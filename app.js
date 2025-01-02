const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");             // Bhai Bhai bhai sign up route per direct response bhej direct URL se 
const flash = require("connect-flash");
const ExpressError = require("./Utils/expressError.js");
const User = require("./Model/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const MongoStore = require('connect-mongo');




if (process.env.NODE_ENV != "production") {
    dotenv.config();
}


// Import routes
const listingRoutes = require("./Routes/listingRoutes.js");
const reviewRoutes = require("./Routes/reviewRoutes.js");
const userRoutes = require("./Routes/userRoutes.js");

const app = express();

const MongoDbUrl = "mongodb+srv://vermapratyush486:6268788553@cluster0.t3l7h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Database setup
async function connectToDB(MongoDbUrl) {
    try {
        await mongoose.connect(MongoDbUrl);
        console.log("DataBase Successfully Connected");
    } catch (e) {
        console.log(`Error Occurred : ${e}`);
        process.exit(1);
    }
}
connectToDB(MongoDbUrl);


// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Public")));
app.use(methodOverride("_method"));
app.use(cookieParser());


const store = MongoStore.create({
    mongoUrl: MongoDbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("Some error In atlas sesion", err);
})

// Session configuration
const sessionConfig = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionConfig));
app.use(flash());

// Intializing Passport 
app.use(passport.initialize());     // This will intialize the passport
app.use(passport.session());


// Passport Configuration 
passport.use(new LocalStrategy(User.authenticate()));   // This will authenticate via Local Stategy and with User this will interact
passport.serializeUser(User.serializeUser());     // This will Store userID to the Session
passport.deserializeUser(User.deserializeUser());   // This will Retrieve UserID and convert it to the Documents to give Authorization


// Flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// Routes
app.use("/listings", userRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

// Error handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("Listings/error.ejs", { message });
});

// Server startup
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//hello claude arey Mein ko na ek doubt hai dekh jaise ki maine ke chij banayi hai ki koi user na create new listings wale page per gaya and login nahi hai toh woh login page per chale jaye and login hote hi direct fir create new listings per chale jaye that means jis page se login per redirect hua hai woh wapas usi page per chale jaye but ab dikkat yeh ho rahi hai ki manle koi use create new listings per gaya aur login page per redirect hote hi woh login na karne ki bajaye woh aise hi website ke dusre page per chale gaya lekin ab woh khud se jab login ke pag per jata hai and login hote hi woh na jab login na karne ki bajaye aur kahi  chale gaya tha toh woh mere code ne yaad rakhliya tha and use waps usi page per pohocha diya toh mein chahta hu ke esa na ho 