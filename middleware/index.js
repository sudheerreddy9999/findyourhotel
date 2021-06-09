var middlewareObj = {};
var Comment = require("../models/comment");
var Hotel = require("../models/camp");
middlewareObj.checkCampOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {

        Hotel.findById(req.params.id, function(err, foundCamp) {
            if (err) {
                req.flash("error", "Camp not found");
                console.log(err);
            } else {
                if (foundCamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that !");
                    res.redirect("back")
                }

            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect('back');
    }

};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {

        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                req.flash("error", "Comment not found");
                console.log(err);
            } else {
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that !");
                    res.redirect("back")
                }

            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect('back');
    }

};
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that !");
    res.redirect("/login");
};
module.exports = middlewareObj;