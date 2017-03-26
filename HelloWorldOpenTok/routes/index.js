var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
//Auth Routes
router.get("/register", function(req, res){
    if (req.user) {
        res.redirect("/");
    } else {
   res.render("register"); 
    }
});

router.get("/dashboard", function(req, res){
   res.render("dashboard"); 
});

router.post("/register", function(req, res){
   User.register(new User({username: req.body.username, type: req.body.type, enable: false}), req.body.password, function(err, user){
        if (err) {
            console.log(err.message);
            req.flash("error", err.message);
            return res.redirect("register");
        }  else  {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to Hack59, " + user.username + "!");
                res.redirect("/");
            });
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


module.exports = router;