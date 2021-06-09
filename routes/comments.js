var express = require("express");
var router = express.Router();
var Hotel = require("../models/camp");
var Comment = require("../models/comment");
var checkCommentOwnership = require("../middleware").checkCommentOwnership;
var isLoggedIn = require("../middleware").isLoggedIn;



router.get('/Hotels/:id/comments/new', isLoggedIn, (req, res) => {
    Hotel.findById(req.params.id, function(err, foundCamp) {
        if (err) {
            console.log(err);
        } else {

            res.render("comments/new", { camp: foundCamp });
        }
    });

});

router.post('/Hotels/:id/comments', isLoggedIn, (req, res) => {
    var comment = req.body.comment;
    var author = req.user;
    Hotel.findById(req.params.id, function(err, Hotel) {
        if (err) {
            console.log(err);
        } else {
            Comment.create({
                text: comment

            }, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    Hotel.comments.push(comment);
                    Hotel.save();
                    console.log("Created new comment");
                }
                req.flash("info", "You have added your comment to " + Hotel.name + ".")
                res.redirect('/Hotels/' + req.params.id);
            });

        }
    });

});
router.get('/Hotels/:id/comments/:comment_id/edit', checkCommentOwnership, (req, res) => {
    Hotel.findById(req.params.id, function(err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            Comment.findById(req.params.comment_id, function(err, comment) {
                if (comment) {
                    res.render("comments/edit", { camp: foundCamp, comment: comment });
                }
            });

        }
    });

});
router.put('/Hotels/:id/comments/:comment_id/', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {

        } else {
            req.flash("info", "You have updated your comment.")
            res.redirect('/Hotels/' + req.params.id);
        }
    });
});

router.delete('/Hotels/:id/comments/:comment_id/', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, req.body.comment, function(err, deletedComment) {
        if (err) {

        } else {
            Hotel.findById(req.params.id)
            req.flash("info", "You have removed your comment.")
            res.redirect('/Hotels/' + req.params.id);
        }
    });
});

module.exports = router;