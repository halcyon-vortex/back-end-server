var router = require('express').Router();
var oAuth = require('../auth/githubAuth');
var controller = require('./dashboardController');

router.route('/')
.get(oAuth.ensureAuth, controller.get);

module.exports = router;