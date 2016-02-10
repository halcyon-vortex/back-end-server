var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var qs = require('qs')
var request = require('request');
var app = express();
var api = require('./api/api');
var githubAuth = require('./auth/githubAuth');
var dashboard = require('./dashboard/dashboard.js');
var apikeys = require('./config/apikeys.js');
var path = require('path');

var redis = require('redis');
console.log("DOCKER ENVS: REDIS TCP ADDRESS/PORT" + process.env.REDIS_PORT_6379_TCP_ADDR + ':' + process.env.REDIS_PORT_6379_TCP_PORT);

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

// set up global error handling

//OAuth

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname + '/../client/login.html'));
})

app.get('/auth/github', function(req, res) {
  res.redirect('https://github.com/login/oauth/authorize?' + qs.stringify({
    client_id: '798b2a1a2446590d941c',
    redirect_uri: 'http://127.0.0.1:8080/auth/github/callback'
  }));
})

app.get('/auth/github/callback',
  function(req, res) {
    var code = req.query['code'];
    request({
      url: 'https://github.com/login/oauth/access_token?' + qs.stringify({
        client_id: apikeys.githubOauth.clientID,
        client_secret: apikeys.githubOauth.clientSecret,
        code: code
      }),
      method: "POST",
      json: true,
      headers: {
        "Accept": "application/json",
        "content-type": "application/json"
      },
      body: {}
    }, function(error, response, body) {
      if (error) {
        throw error;
      }
      res.send(body)
    });


    // Successful authentication, redirect home.
  });



// export the app for testing
app.use(express.static(__dirname + '/../client'));

module.exports.app = app;