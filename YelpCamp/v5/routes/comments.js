var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}
function checkCommentOwnership(req, res, next){
    if (req.isAuthenticated())
    {
        Comment.findById(req.params.cid, function(err, foundComment){
           if (err){
               res.redirect("back");
           } else {
               if(String(foundComment.author.id) === String(req.user._id)) {
                   next();
               } else {
                   res.redirect("back");
               }
           }
        });
    } else {
        res.redirect("/login");
    }
}

router.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
       if (err) {
           console.log(err);
       } else {
           res.render("commentform", {cgs: foundCampground, currentUser: req.user});
       }
   });
});

router.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
      if (err) {
          console.log("I am the first one!");
          res.redirect("/campgrounds");
      } else {
          Comment.create(req.body.comment, function(err, newComment){
             if (err) {
                 console.log("I am the second one!");
                 console.log(err);
             } else {
                newComment.author.id = req.user._id;
                newComment.author.username = req.user.username;
                console.log(newComment);
                console.log(req.user.username);
                newComment.save();
                foundCampground.comments.push(newComment);
                foundCampground.save();
                res.redirect("/campgrounds/"+ req.params.id);   
             }
          });
      }
   });
});

router.get("/campgrounds/:id/comments/:cid/edit",checkCommentOwnership, function(req, res){
    Comment.findById(req.params.cid, function(err, foundComment){
        if(err) {
            res.redirect("back");
        }     else {
            res.render("commentEdit", {cgs_id: req.params.id, comment:foundComment});
        }
    });
});

router.put("/campgrounds/:id/comments/:cid",checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.cid, req.body.comment, function(err, updatedComment){
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

router.delete("/campgrounds/:id/comments/:cid",checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.cid, function(err){
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("back");
       }
   }) 
});
module.exports = router;