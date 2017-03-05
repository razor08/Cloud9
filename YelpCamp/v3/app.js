var express =  require("express");
var app = express();
var bodyParser = require("body-parser");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelpcamp_v3");

//Passport COnfiguration
app.use(require("express-session")({
    secret: "I am the best in the world!",
    resave: false,
    saveUninitialized: false
}));
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes
app.get("/campGrounds", function(req, res){
   Campground.find({}, function(err, allCampgrounds){
      if(err) {
          console.log(err);
      } else {
          res.render("campgrounds/campGrounds", {cgs: allCampgrounds, currentUser: req.user});
      }
   });
});

app.post("/campGrounds/new",isLoggedIn, function(req, res){
    Campground.create(req.body.campground, function(err, newCampground){
       if (err) {
           res.redirect("/campgrounds/new");
       } else {
           res.redirect("/campgrounds/" + newCampground._id);
       }
    });  
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
       if (err){
           console.log(err);
       } else {
           console.log(foundCampground);
           res.render("campgrounds/show", {cgs: foundCampground});
       }
    });
});

app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
       if (err) {
           console.log(err);
       } else {
           res.render("commentform", {cgs: foundCampground});
       }
   });
});

app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
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
                console.log(newComment);
                foundCampground.comments.push(newComment);
                foundCampground.save();
                res.redirect("/campgrounds/"+ req.params.id);   
             }
          });
      }
   });
});

//Auth Routes
app.get("/register", function(req, res){
   res.render("register"); 
});

app.post("/register", function(req, res){
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

app.get("/login", function(req, res){
   res.render("login"); 
});

app.post("/login",passport.authenticate("local",
    {successRedirect: "/campgrounds",
     failureRedirect: "/login"
    }),  function(req, res){
    
});

app.get("/logout", function(req, res){
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

app.get("/*", function(req, res){
    res.send("Sorry, page not found...What are you doing with your life ?");    
});

//PORT listen logic!
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is up and running! Go ahead make your move."); 
});