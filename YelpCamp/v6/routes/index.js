var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
//Auth Routes
router.get("/register", function(req, res){
   res.render("register"); 
});

router.post("/register", function(req, res){
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err) {
            console.log(err.message);
            req.flash("error", err.message);
            return res.redirect("register");
        }  else  {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp.com, " + user.username + "!");
                res.redirect("/campgrounds");
            });
        }
   });
});

router.get("/login", function(req, res){
   res.render("login", {message: req.flash("error")}); 
});

router.post("/login",passport.authenticate("local",
    {successRedirect: "/campgrounds",
     failureRedirect: "/login"
    }),  function(req, res){
    
});

router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/");
});


module.exports = router;