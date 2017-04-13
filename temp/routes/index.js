var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

function checkAuth(req, res, next) {
    if (req.user.type === "admin") {
        next();
    } else {
        req.flash("error", "You are not authorised to do that!");
        res.redirect("back");
    }
}


//Auth Routes
router.get("/register", function(req, res){
    if (req.user) {
        res.redirect("/");
    } else {
   res.render("register"); 
    }
});

router.get("/dashboard", function(req, res){
    if (String(req.user.type) === "admin") {
        User.find({}, function(err, allUsers){
           if (err) {
               console.log("Some unknown error occured!");
           } else {
            res.render("adminDashboard",{currentUser: req.user, allUsers: allUsers});           }
        });
                
    } else {
        if (req.user.enable === false) {
            req.flash("error", "Please get your account approved first!");
            res.redirect("/logout");
               } else {
   res.render("dashboard",{currentUser: req.user}); 
    }
    }
});

router.post("/register", function(req, res){
   User.register(new User({username: req.body.username, type: req.body.type, enable: false}), req.body.password, function(err, user){
        if (err) {
            console.log(err.message);
            req.flash("error", err.message);
            return res.redirect("register");
        }  else  {
            if (user.enable === false) {
                passport.authenticate("local")(req, res, function(){
                req.flash("success", "Get your ID enabled by the admin first and Welcome, " + user.username + "!");
                res.redirect("/");
            });
            } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to Hack59, " + user.username + "!");
                res.redirect("/");
            });
        }
        }
   });
});

router.get("/login", function(req, res){
    if (req.user) {
        res.redirect("/");
    } else {
   res.render("login", {message: req.flash("error")}); 
    }
});

router.post("/login",passport.authenticate("local",
    {successRedirect: "/dashboard",
     failureRedirect: "/login"
    }),  function(req, res){
});

router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/");
});

router.delete("/:id/delete",checkAuth, function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log("Something went wrong with deleting a user!");
        } else {
            req.flash("success", "User successfully deleted!");
            res.redirect("back");
        }
    });
});

router.get("/:id/changeToAdmin", function(req, res){
   User.findByIdAndUpdate(req.params.id, {type: "admin"}, function(err){
       if (err) {
           console.log(err);
       } else {
           req.flash("success", "User successfully changed to admin!");
           res.redirect("back");
       }
   }) 
});

router.get("/:id/enable", checkAuth, function(req, res){
    User.findByIdAndUpdate(req.params.id, {enable: "true"}, function(err){
       if (err)
       {
           console.log(err);
       } else {
           req.flash("success", "User successfully enabled!");
           res.redirect("back");
       } 
    });
});

router.get("/:id/disable", checkAuth, function(req, res){
    User.findByIdAndUpdate(req.params.id, {enable: "false"}, function(err){
       if (err)
       {
           console.log(err);
       } else {
           req.flash("success", "User successfully disabled!");
           res.redirect("back");
       } 
    });
});

module.exports = router;