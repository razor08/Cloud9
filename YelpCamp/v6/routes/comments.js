var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
       if (err) {
           console.log(err);
       } else {
           res.render("commentform", {cgs: foundCampground, currentUser: req.user});
       }
   });
});

router.post("/campgrounds/:id/comments",middleware.isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
      if (err) {
          console.log("I am the first one!");
          req.flash("error", "Something went wrong!");
          res.redirect("/campgrounds");
      } else {
          Comment.create(req.body.comment, function(err, newComment){
             if (err) {
                 req.flash("error", "Something went wrong!");
                 console.log(err);
             } else {
                newComment.author.id = req.user._id;
                newComment.author.username = req.user.username;
                console.log(newComment);
                console.log(req.user.username);
                newComment.save();
                foundCampground.comments.push(newComment);
                foundCampground.save();
                req.flash("success", "Comment successfully added!");
                res.redirect("/campgrounds/"+ req.params.id);   
             }
          });
      }
   });
});

router.get("/campgrounds/:id/comments/:cid/edit",middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.cid, function(err, foundComment){
        if(err) {
            req.flash("error", "Comment not found!");
            res.redirect("back");
        }     else {
            res.render("commentEdit", {cgs_id: req.params.id, comment:foundComment});
        }
    });
});

router.put("/campgrounds/:id/comments/:cid",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.cid, req.body.comment, function(err, updatedComment){
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

router.delete("/campgrounds/:id/comments/:cid",middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.cid, function(err){
       if (err) {
           req.flash("error", "Something went wrong!");
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted!");
           res.redirect("back");
       }
   }) 
});
module.exports = router;