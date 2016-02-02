var chai = require('chai');
var assert = require('assert')
var expect = chai.expect;
var sinon = require('sinon');
var oAuth = require('../auth/githubAuth.js');
var redis = require('redis');

describe("REST API Routes", function() {
  var ensureAuthenticatedSpy;
  var dailyArgs = ['daily:all', 4.2, "proj1", 35, "proj2", 109.3, "proj3"];

  var dailyArgsPython = ['daily:python', 4, "proj1", 3.5, "proj2", 1, "proj3"];



  before(function() {
    //pre-populate test data
    if (process.env.REDIS_PORT_6379_TCP_ADDR) {
      var client = redis.createClient('6379', 'redis');
    } else {
      var client = redis.createClient('6379');
    }
    client.zadd(dailyArgs, function(err, response) {
      if (err) throw err;
      console.log('added ' + response + ' items.');
    })
    client.zadd(dailyArgsPython, function(err, res) {
      if (err) throw err;
      console.log('added ' + res + ' items.');
    })

    //set stub to bypass oAuth middleware
    ensureAuthenticatedSpy = sinon.stub(oAuth, 'ensureAuth');
    //calls next() when inside ensureAuth
    ensureAuthenticatedSpy.callsArg(2);

    //important to stub before we load our app
    agent = require('supertest')
      .agent(require('../server.js').app);

    client.quit()
  });
  after(function(done) {
    if (process.env.REDIS_PORT_6379_TCP_ADDR) {
      console.log('IM IN THE CORRECT BLOCK')
      var client = redis.createClient('6379', 'redis');
    } else {
      var client = redis.createClient('6379');
    }
    client.del(dailyArgs, function(err, res) {
      if (err) throw err;
      console.log('deleted ' + res + 'items')
      client.quit(done)
    })
    client.del(dailyArgsPython, function(err, res) {
      if (err) throw err;
      console.log('deleted ' + res + 'items')
      client.quit(done)
    })


  })

  describe('TRENDING DATA ROUTES', function() {
    describe('TOP DAILY OVERALL', function() {
      it('responds with a 200 (OK) and the json data for the top daily repos', function(done) {
        agent
          .get('/api/daily')
          .expect(function(res) {
            expect(res.body[0][0]).to.equal("proj3")
          })
          .expect(200, done);
      })
    })
    describe('TOP DAILY BY LANGUAGE', function() {
      it('responds with a 200 (OK) and the json data for the top daily repos by language', function(done) {
        agent
          .get('/api/daily/python')
          .expect(function(res) {
            expect(res.body[0][0]).to.equal("proj1")
          })
          .expect(200, done);
      })
    })
  })

});