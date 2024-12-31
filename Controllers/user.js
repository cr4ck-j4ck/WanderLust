const User = require("../Model/user.js");



module.exports.renderSignupForm = (req, res) => {
    res.render("Listings/signUp.ejs");
}

module.exports.registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({
            username, email
        });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "User Registered Successfully!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/listings/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("Listings/login.ejs");
}


module.exports.afterLogin = (req, res) => {
    req.flash("success", "Welcome to WanderLust, Good to See you Again !");
    res.locals.redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(res.locals.redirectUrl);
}


module.exports.logOut = (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged Out successfully");
        res.redirect("/listings");
    });
}