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
            console.log(err);
            res.rennder("register");
        }  else  {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds");
            });
        }
   });
});

router.get("/login", function(req, res){
   res.render("login"); 
});

router.post("/login",passport.authenticate("local",
    {successRedirect: "/campgrounds",
     failureRedirect: "/login"
    }),  function(req, res){
    
});


router.get('/login/google',
  passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'}));

router.get('/login/google/return', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


router.get('/login/facebook',
  passport.authenticate('facebook'));

router.get('/login/facebook/return', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/login/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/login/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}
module.exports = router;