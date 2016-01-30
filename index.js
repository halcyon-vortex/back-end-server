// var config = require('./server/config/config');
var port = 8080;
var app = require('./server/server').app;
var logger = require('./server/util/logger');

app.listen(port);
logger.log('listening on http://localhost:' + port);