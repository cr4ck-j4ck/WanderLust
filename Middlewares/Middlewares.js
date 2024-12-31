const wrapAsync = require("../Utils/wrapAsync.js");
const Listing = require("../Model/listing.js");
const { valid } = require("../schema.js");
const ExpressError = require("../Utils/expressError.js");
const { validReview } = require("../schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You'll Have to First login");
        res.redirect("/listings/login");
    } else {
        next();
    }
}

module.exports.savedRedirectUrl = (req, res, next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
}


module.exports.isOwner = wrapAsync(async (req, res, next) => {
    const list = await Listing.findById(req.params.id);
    if (res.locals.currentUser && !list.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the Owner of this!! ");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
});


module.exports.validateSchema = (req, res, next) => {
    const { error } = valid.validate(req.body);
    if (!error) return next();

    const msg = error.details[0].message.split('.').pop();
    throw new ExpressError(400, msg.startsWith('"') ? msg : `"${msg}`);
};

module.exports.validateReview = (req, res, next) => {
    const { error } = validReview.validate(req.body);
    if (!error) return next();

    const errorMessage = error.details[0].message
        .split('.')
        .pop()
        .trim();

    throw new ExpressError(400,
        errorMessage.startsWith('"') ? errorMessage : `"${errorMessage}`
    );
};  
