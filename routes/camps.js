var express = require("express");
var router = express.Router();
var Hotel = require("../models/camp")
var checkCampOwnership = require("../middleware").checkCampOwnership;
var isLoggedIn = require("../middleware").isLoggedIn;
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);


var searchedCamps;
router.get("/Hotels", function(req, res) {
    if (!searchedCamps) {
        Hotel.find({}, function(err, allCamps) {
            if (err) {
                console.log(err);
            } else {
                res.render("camps/index", { camps: allCamps });
            }
        });
    } else {
        res.render("camps/index", { camps: searchedCamps });
        searchedCamps = null;

    }

});
router.post('/Hotels', isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    Hotel.create({ name: name, image: image, description: description, author: { id: req.user._id, username: req.user.username }, location: req.body.location },
        function(err, Hotel) {
            if (err) {
                console.log(err);
            } else {
                console.log("New Camp created");
                req.flash("info", "Successfully created the Hotel " + Hotel.name)
                res.redirect('/Hotels');
            }
        }
    )

});

router.post('/Hotels/search', (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;

    if (req.body.search == 0) res.redirect("/Hotels");

    if (req.body.search && req.body.search_by) {
        var search_by = req.body.search_by;
        Hotel.find({
                [search_by]: new RegExp('\\b' + req.body.search + '\\b', 'i')
            },
            function(err, data) {
                searchedCamps = data;
                res.redirect('/Hotels');
            });
    }

});
//CREATE - add new Hotel to DB
router.post("/", isLoggedIn, function(req, res) {
    // get data from form and add to Hotels array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function(err, data) {
        if (err || !data.length) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newHotel = { name: name, image: image, description: desc, author: author, location: location, lat: lat, lng: lng };
        // Create a new Hotel and save to DB
        Hotel.create(newHotel, function(err, newlyCreated) {
            if (err) {
                console.log(err);
            } else {
                //redirect back to Hotels page
                console.log(newlyCreated);
                res.redirect("/Hotels");
            }
        });
    });
});
router.get('/Hotels/new', isLoggedIn, (req, res) => {
    res.render("camps/new");
});



router.get('/Hotels/:id', (req, res) => {
    Hotel.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            res.render("camps/show", { camp: foundCamp });
        }
    });

});



router.get('/Hotels/:id/edit', checkCampOwnership, (req, res) => {

    Hotel.findById(req.params.id, function(err, foundCamp) {
        res.render("camps/edit", { camp: foundCamp });
    });
});


router.put('/Hotels/:id/', checkCampOwnership, (req, res) => {
    console.log("Edited a camp");
    Hotel.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCamp) {
        if (err) {

        } else {
            req.flash("info", "You edited the Hotel " + updatedCamp.name)
            res.redirect('/Hotels/' + req.params.id);
        }
    });
});

router.delete('/Hotels/:id', checkCampOwnership, (req, res) => {
    Hotel.findByIdAndDelete(req.params.id, req.body.camp, function(err, updatedCamp) {
        if (err) {

        } else {
            req.flash("info", "You removed the Hotel " + updatedCamp.name)
            res.redirect('/Hotels/');
        }
    });
});



module.exports = router;