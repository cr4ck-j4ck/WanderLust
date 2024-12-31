const express = require("express");
const { Router } = express;
const { validateReview, isLoggedIn } = require("../Middlewares/Middlewares.js");
const reviewController = require("../Controllers/review.js");


// Utilities
const wrapAsync = require("../Utils/wrapAsync.js");

const router = Router({ mergeParams: true });



// handling reviews from this
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


//reviews ko delete karna
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.destroyReviews));

module.exports = router;