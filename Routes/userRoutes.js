const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const userController = require("../Controllers/user.js");
const wrapAsync = require("../Utils/wrapAsync.js");
const { savedRedirectUrl } = require("../Middlewares/Middlewares.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.registerUser));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        savedRedirectUrl,
        passport.authenticate('local', { failureRedirect: '/listings/login', failureFlash: true }),
        userController.afterLogin
    );

router.get("/logout", userController.logOut);

module.exports = router;