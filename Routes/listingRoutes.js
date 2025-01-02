const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateSchema } = require("../Middlewares/Middlewares.js");
const ListingController = require("../Controllers/listings.js");
const multer = require('multer')
const { storage } = require("../cloudeConfig.js");
const upload = multer({ storage })


router.route("/")
    .get(wrapAsync(ListingController.index))                                                       // Show all listings
    .post(isLoggedIn, upload.single("listing[image]"), validateSchema, wrapAsync(ListingController.createListings));       // Create new listing

// Show new listing form
router.get("/new", isLoggedIn, ListingController.renderAddForm);


router.route("/:id")
    .get(wrapAsync(ListingController.showListings))          //Details print karega show.ejs mein kisi bhi listings ki breif mein
    .patch(isLoggedIn, upload.single("listing[image]"), validateSchema, isOwner, wrapAsync(ListingController.updateListings))      // Update a listing
    .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListings));          // Delete a listing


// Show edit form for a listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.showEditForm));


module.exports = router;