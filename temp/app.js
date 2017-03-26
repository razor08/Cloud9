var methodOverride = require("method-override");
var express =  require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var indexRoutes = require("./routes/index");
var flash = require("connect-flash");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/hack59_2");
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

app.use(indexRoutes);

var OpenTok = require('opentok');

// Verify that the API Key and API Secret are defined
var apiKey = 45805602,
    apiSecret = "b8bf9cafcad900da2c2d23eed5882b4fff91837e";
if (!apiKey || !apiSecret) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
}

// Initialize the express app
app.use(express.static(__dirname + '/public'));

// Initialize OpenTok
var opentok = new OpenTok(apiKey, apiSecret);

// Create a session and store it in the express app
opentok.createSession(function(err, session) {
  if (err) throw err;
  app.set('sessionId1', session.sessionId);
  // We will wait on starting the app until this is done
  
});

opentok.createSession(function(err, session) {
  if (err) throw err;
  app.set('sessionId2', session.sessionId);
  // We will wait on starting the app until this is done
  
});

opentok.createSession(function(err, session) {
  if (err) throw err;
  app.set('sessionId3', session.sessionId);
  // We will wait on starting the app until this is done
  
});

opentok.createSession(function(err, session) {
  if (err) throw err;
  app.set('sessionId4', session.sessionId);
  // We will wait on starting the app until this is done
  
});

opentok.createSession(function(err, session) {
  if (err) throw err;
  app.set('sessionId5', session.sessionId);
  // We will wait on starting the app until this is done
  
});


app.get('/physician', function(req, res) {
  var sessionId = app.get('sessionId1'),
      // generate a fresh token for this client
      token = opentok.generateToken(sessionId);

  res.render('index.ejs', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token,
    currentUser: req.user
  });
});

app.get('/surgeon', function(req, res) {
  var sessionId = app.get('sessionId2'),
      // generate a fresh token for this client
      token = opentok.generateToken(sessionId);

  res.render('index.ejs', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token,
    currentUser: req.user});
});

app.get('/cardiologist', function(req, res) {
  var sessionId = app.get('sessionId3'),
      // generate a fresh token for this client
      token = opentok.generateToken(sessionId);

  res.render('index.ejs', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token,
    currentUser: req.user});
});

app.get('/orthopaedic', function(req, res) {
  var sessionId = app.get('sessionId4'),
      // generate a fresh token for this client
      token = opentok.generateToken(sessionId);

  res.render('index.ejs', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token,
    currentUser: req.user});
});
// Start the express app

app.get('/allergist', function(req, res) {
  var sessionId = app.get('sessionId5'),
      // generate a fresh token for this client
      token = opentok.generateToken(sessionId);

  res.render('index.ejs', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token,
    currentUser: req.user});
});

app.get("/", function(req, res){
   res.render("landing",{currentUser: req.user});
});

app.get("/setup", function(req, res){
  var admin = {
    username: "admin",
    password: "password",
    enable: false,
    type: "admin"
  };
  User.register(new User({username: admin.username, type: admin.type, enable: false}), admin.password, function(err, user){
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

app.get("/*", function(req, res){
    res.send("Sorry, page not found...What are you doing with your life ?");    
});

//PORT listen logic!
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is up and running! Go ahead make your move."); 
});