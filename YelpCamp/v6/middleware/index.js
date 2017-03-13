var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.compareOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                console.log(err);
                req.flash("error", "Campground not found!");
                res.redirect("/campgrounds");
            } else {
            if (String(foundCampground.author.id) === String(req.user._id)) {
                next();
            } else {
                req.flash("error", "You are not authorised to do that!");
                res.redirect("back");
            }
            }
        });
    } else {
        req.flash("error", "You need to be logged in!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated())
    {
        Comment.findById(req.params.cid, function(err, foundComment){
           if (err){
               req.flash("error", "Something went wrong!");
               res.redirect("back");
           } else {
               if(String(foundComment.author.id) === String(req.user._id)) {
                   next();
               } else {
                   req.flash("error", "You are not authorised to do that!");
                   res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "You need to be logged in!");
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "You need to be logged in!");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;