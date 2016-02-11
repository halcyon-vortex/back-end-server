var _ = require('lodash');
var redis = require('redis');
// var client = require('../../server.js')

if (process.env.REDIS_PORT_6379_TCP_ADDR) {
  var client = redis.createClient('6379', 'redis');
} else {
  var client = redis.createClient('6379');
}

exports.getAll = function(req, res, next) {
  var namespace = 'daily:';
  var key = namespace + 'all';

  client.zrevrange(key, 0, -1, 'withscores', function (err, members){
    if (err) next(err);
    var lists=_.groupBy(members, function(a,b) {
        return Math.floor(b/2);
    });
    var tuples = _.toArray(lists);
    res.send(tuples);
  });

};


exports.getForLang = function(req, res, next) {
  var path = req.params.language;

  var namespace = 'daily:';
  var key = namespace + path;

  client.zrevrange(key, 0, -1, 'withscores', function (err, members){
    if (err) next(err)
    var lists=_.groupBy(members, function(a,b) {
        return Math.floor(b/2);
    });
    res.send(_.toArray(lists))
  });

};