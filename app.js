var express = require("express"),
    app = express(),
    bp = require('body-parser'),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    seedDb = require("./seeds"),
    flash = require("connect-flash");
// Passport Configuration
app.use(express.static(__dirname + "/public"));


app.use(require("express-session")({
    secret: "Vishnu Teja bandi",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var campRoutes = require("./routes/camps"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost/hotel_go", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// seedDb();

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    next();
});


app.use(commentRoutes);
app.use(campRoutes);
app.use(indexRoutes);

// ***********************************************************************

app.listen(3000, "localhost", function() {
    console.log("The server has started")
});