var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var GithubStrategy = require('passport-github');
var app = express();
var api = require('./api/api');
var githubAuth = require('./auth/githubAuth')
var dashboard = require('./dashboard/dashboard.js')
var apikeys = require('./config/apikeys.js');
var path = require('path')

var redis = require('redis');
console.log("DOCKER ENVS: " + process.env.REDIS_PORT_6379_TCP_ADDR + ':' + process.env.REDIS_PORT_6379_TCP_PORT);

if (process.env.REDIS_PORT_6379_TCP_ADDR) {
  var client = redis.createClient('6379', 'redis');
} else {
  var client = redis.createClient('6379');
}



// setup the app middlware
require('./middleware/appMiddleware')(app);

// setup the api
app.use('/api/', api);
app.use('/dashboard/', dashboard)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({
  secret: 'shhhhh this is a secret',
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// set up global error handling

//OAuth
passport.serializeUser(function(user, done) {
  console.log('serialized')
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  console.log('deserialized')
  done(null, id);
});

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname + '/../client/login.html'));
})

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/api/daily');
    
  });



// When user logged in does a get req to auth/google/callback
passport.use(new GithubStrategy({
  clientID: apikeys.githubOauth.clientID,
  clientSecret: apikeys.githubOauth.clientSecret,
  // callbackURL: "https://fathomless-sands-7752.herokuapp.com/auth/google/callback"
  callbackURL: "http://127.0.0.1:8080/auth/github/callback"
}, function(accessToken, refreshToken, profile, done) {
  githubAuth.login(profile,accessToken,refreshToken,
    function(err, profile, accessToken, refreshToken) {
      return done(err, profile);

    });

  // controllers.isUserInDb(profile.emails[0].value, function(inDb) {
  //   // if the username/email is in the database run login
  //   if (inDb) {
  //     googleAuth.login({
  //       profile: profile
  //     }, function(err, profile) {
  //       return done(err, profile);
  //     });
  //   } else {
  //     googleAuth.signup({
  //       profile: profile
  //     }, function(err, profile) {
  //       return done(err, profile);
  //     })
  //   }
  // })
}));

// export the app for testing
app.use(express.static(__dirname + '/../client'));

module.exports.app = app;