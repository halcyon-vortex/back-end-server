var apikeys = require('../config/apikeys.js');

exports.ensureAuth = function(req, res, next) {
    res.redirect('/login')
};

exports.signup = function(profileObj, callback) {
  console.log(profileObj)
  var user;
  // // profileObj equals the userinfo that google sends upon signin
  // var user = {};
  // // creates a user object with only the info we want from google
  // user.name_last  = profileObj.profile.name.familyName;
  // user.name_first = profileObj.profile.name.givenName;
  // user.name = user.name_first + " " + user.name_last;
  // user.email = profileObj.profile.emails[0].value;
  // user.username = user.email;
  // // Email set as username to make sure each username is unique.
  // // Usernames are used to find to find specific user(s) in the database
  // // Suggested Improvement: Make this a token or id saved in the database for each user.

  // user.picture = profileObj.profile._json.image.url;

  // // Other Attributes Google Provides that you may want to utilize
  // // user.displayName = profileObj.profile.displayName;
  // // user.gender = profileObj.profile.gender;
  // // user.nickName = profileObj.profile._json.nickname;

  // controller.newUser(user);
  // saves the new user to the database
  return callback(null, user);
};

exports.login = function(profile, accessToken, refreshToken, callback) {
  return callback(null, profile, accessToken, refreshToken);

};