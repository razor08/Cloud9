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
var Strategy = require('passport-google-oauth20').Strategy;
var Strategy1 = require('passport-facebook').Strategy;
var GitHubStrategy = require('passport-github2').Strategy;


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://razor08:hailhydra<3@ds159050.mlab.com:59050/telpcamp_v7");
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

app.use(require('cookie-parser')());


passport.use(new Strategy({
    clientID: "808193311207-1fbgsiipc4qgofnb54dj9ccjt2dd9b5b.apps.googleusercontent.com",
    clientSecret: "9qrB0mBuYn6ZmoHAdfchNeGa",
    callbackURL: 'https://glacial-thicket-65228.herokuapp.com/login/google/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));

passport.use(new Strategy1({
    clientID: "678926268982556",
    clientSecret: "adc15a2d2505237959416c62f6308b47",
    callbackURL: 'https://glacial-thicket-65228.herokuapp.com/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));

passport.use(new GitHubStrategy({
    clientID: "3bf09bcd0126d1fe3f57",
    clientSecret: "73585694f00aa54b27a40f0dec48f5ad11ee01d1",
    callbackURL: "https://glacial-thicket-65228.herokuapp.com/login/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
     return done(null, profile);
  }
));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

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