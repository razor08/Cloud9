var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){
   Campground.find({}, function(err, allCampgrounds){
      if(err) {
          console.log(err);
      } else {
          res.render("campgrounds/home", {campgrounds: allCampgrounds, currentUser: req.user});
      }
   });
});

router.get("/new",middleware.isLoggedIn, function(req, res){
   Campground.find({}, function(err, allCampgrounds){
      if(err) {
          console.log(err);
      } else {
          res.render("campgrounds/campGrounds", {cgs: allCampgrounds, currentUser: req.user});
      }
   });
});

router.post("/new",middleware.isLoggedIn, function(req, res){
    Campground.create(req.body.campground, function(err, newCampground){
       if (err) {
           res.redirect("/new");
       } else {
          newCampground.author.id = req.user._id;
          newCampground.author.username = req.user.username;
           /*var author = {
               id: req.user._id,
               username: req.user.username
           }*/
           newCampground.save();
           console.log("Just created the campground!");
           console.log(newCampground);
           res.redirect("/campgrounds/" + newCampground._id);
       }
    });  
});

router.get("/:id", function(req, res){
    var allCGS;
    Campground.find({}, function(err, allCampgrounds){
      if(err) {
          console.log(err);
      } else {
          allCGS = allCampgrounds;
      }
   });
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
       if (err){
           console.log(err);
       } else {
           if (foundCampground) {
           res.render("campgrounds/show", {cgs: foundCampground, currentUser: req.user, allCGS: allCGS});
       } else {
           res.redirect("/campgrounds");
       } }
    });
});

router.get("/:id/edit",middleware.compareOwnership,  function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            req.flash("error", "Campground not found!");
            res.redirect("back");
        } else {
           res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

router.put("/:id",middleware.compareOwnership,  function(req, res){
   Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err, updatedCampground){
          res.redirect("/campgrounds/"+ updatedCampground._id);
      })
});

router.delete("/:id",middleware.compareOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err) {
            res.redirect("/");
        })
});

module.exports = router;