var _ = require('lodash');
var redis = require('redis');
if (process.env.REDIS_PORT_6379_TCP_ADDR) {
  var client = redis.createClient('6379', 'redis');
} else {
  var client = redis.createClient('6379');
}

exports.getTrending = function(req, res, next) {
  var language = req.query.language || 'All';
  var time_range = req.query.time_range || 'curr_week';
  var trending_modifier = req.query.trending_modifier || 'high';

  var key = language+":"+time_range+"_"+trending_modifier;

  client.zrevrange(key, 0, -1, 'withscores', function (err, members){
    if (err) throw(err);
    // console.log('all the members: ', members, '\n');

    json_members = [];
    for (var i = 0; i < members.length-1; i+=2) {
      var repo_info = JSON.parse(members[i]);
      repo_info['score'] = Number(members[i+1]);
      json_members.push(repo_info);
    }
    // console.log('json members: ', json_members );
    res.json( json_members );
  });

};