var express = require("express");
var app = express();
var passport = require("passport");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var User = require("./models/users");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/passport_app");
app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "Rusty is a very cute and nice dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
//Routes from now on...

app.get("/", function(req, res){
   res.render("home");
});

app.get("/register", function(req, res){
   res.render("register"); 
});

app.post("/register", function(req, res){
    var user = req.body.username;
    var pass = req.body.password;
    User.register(new User({username: user}), pass, function(err, user){
       if(err){
           console.log(err);
           return res.render("/register");
       } else {
           passport.authenticate("local")(req, res, function(){
              res.redirect("/secret"); 
           });
       }
    });
});

app.get("/secret", isLoggedIn, function(req, res){
   res.send("secret page!"); 
});

app.get("/login", function(req, res){
   res.render("login"); 
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
    
});

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is up and running!"); 
});

