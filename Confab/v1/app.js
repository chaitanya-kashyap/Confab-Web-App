let express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

mongoose.connect("mongodb://localhost/Confab");
app.use(require("express-session")({
  secret: "I am awesome",
  resave: false,
  saveUninitialized: false
}));

let User = require("./models/signup.js");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function(req, res) {
  res.render('landing');
});

app.get('/sign', function(req, res) {
res.render('new');
});

app.post('/sign', (req, res, next) => {
  passport.authenticate('local',
  (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect('/sign?info=' + info);
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      return res.redirect('/homepage');
    });

  })(req, res, next);
});

app.get('/new', (req, res) => {
  res.render('user');
});

app.post('/new', (req, res) => {
  req.body.username;
  req.body.password;
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err){
      console.log(err);
      return res.render('user');
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect('/homepage')
    })
  })
});

app.get('/homepage', isLoggedIn, (req, res) => {
  res.render('home');
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/new');
};

app.get('/homepage:id', (req,res) => {
  res.render('show');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(7000, () => {
  console.log("Confab Server is started");
});
