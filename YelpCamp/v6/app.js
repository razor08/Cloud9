var methodOverride = require("method-override");
var express =  require("express");
var app = express();
var bodyParser = require("body-parser");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
var flash = require("connect-flash");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelpcamp_v6");
app.use(flash());
app.use(methodOverride("_method"));
//Passport COnfiguration
app.use(require("express-session")({
    secret: "I am the best in the world!",
    resave: false,
    saveUninitialized: false
}));
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);

app.get("/", function(req, res){
   Campground.find({}, function(err, allCgs){
      if (err) {
          res.redirect("/campgrounds");
      } else {
          res.render("landing", {CGList: allCgs});
      }
   });
});

app.get("/*", function(req, res){
    res.send("Sorry, page not found...What are you doing with your life ?");    
});

//PORT listen logic!
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is up and running! Go ahead make your move."); 
});