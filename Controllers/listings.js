const Listing = require("../Model/listing");


module.exports.index = async (req, res) => {
    const listings = await Listing.find();
    res.render("Listings/index.ejs", { allListings: listings });
}

module.exports.renderAddForm = (req, res) => {
    res.render("Listings/new.ejs");
}

module.exports.createListings = async (req, res) => {
    const { filename, path: url } = req.file;
    const listing = new Listing(req.body.listing);
    listing.owner = req.user;
    listing.image = {
        filename, url
    }
    await listing.save();
    req.flash("success", "Listing added Successfully");
    res.redirect("/listings");
}

module.exports.showListings = async (req, res) => {
    if (req.params.id.length !== 24) {
        req.flash("error", "Listing Not Exists");
        return res.redirect("/listings");
    }

    const list = await Listing.findOne({ _id: req.params.id })
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!list) {
        req.flash("error", "Listings May be deleted");
        return res.redirect("/listings");
    }
    res.render("Listings/show.ejs", { list });
}

module.exports.showEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing may be deleted You can't edit");
        return res.redirect("/listings");
    }
    res.render("Listings/edit.ejs", { list: listing });
}

module.exports.updateListings = async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(list);
    if(req.file){
        console.log(req.file);
        const { filename , path: url} = req.file;
        list.image = {
            filename , url
        }
        await list.save();
    }
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListings = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
}