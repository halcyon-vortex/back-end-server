var router = require('express').Router();
var oAuth = require('../auth/githubAuth');


router.use('/trending', require('./trending/trendingRoutes'));
// router.use('/local_graph', require('./local_graph/localGraphRoutes'));

module.exports = router;