var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var isLoggedIn = require("../middleware").isLoggedIn;


router.get("/", function(req, res) {
    res.render("landing");
});


router.post('/register', (req, res) => {

    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/register');
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome " + user.username + " !");
            res.redirect('/Hotels');
        });
    });
});
router.post('/login', passport.authenticate("local", {
    successRedirect: "/Hotels",
    failureRedirect: "/login",
    successFlash: "You have successfully logged in !",
    failureFlash: "Something went wrong! Try again"
}), (req, res) => {

});

router.get('/register', (req, res) => {
    res.render("register");
});

router.get('/login', (req, res) => {
    res.render("login");
});
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash("success", "logged You Out ! ");
    res.redirect('/Hotels');
});
module.exports = router;