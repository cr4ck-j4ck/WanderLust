// Models
const Listing = require("../Model/listing.js");
const Review = require("../Model/reviews.js");


module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body.reviews,res.locals.currentUser);
    review.author = res.locals.currentUser;
    await Promise.all([
        review.save(),
        Listing.findByIdAndUpdate(id, { $push: { reviews: review } })
    ]);
    req.flash("success", "Review added successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReviews = async (req, res) => {
    const { id, reviewId } = req.params;

    let review = await Review.findById(reviewId).populate("author");
    if (review.author._id.equals(res.locals.currentUser._id)) {
        await Promise.all([
            Review.findByIdAndDelete(reviewId),
            Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
        ]);
        req.flash("success", "Review deleted successfully");
        res.redirect(`/listings/${id}`);
    } else {
        req.flash("error","You are not the owner of this review");
        res.redirect(`/listings/${id}`);
    }

}