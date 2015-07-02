var Superagent = require("superagent");
var Promise = require('es6-promise').Promise;

var OptimusPrimeHelper = function (path) {
  var path = path;
  var requestsUrl = "http://localhost:7011/requests/"+ path;
  this.waitFor = 5000;

  this.count = function(callback) {
    this.requester.get(requestsUrl, function(e,r) {
      callback(parseInt(JSON.parse(r.text || '{ "count": 0 }')["count"]));
    });
  };


  // TODO: Refactor this :)
  this.lastRequestFor = function(callback, timeout) {
      var wait = timeout || this.waitFor;
      var primedId = this.id;
      var requestsUrl = "http://localhost:7011/requests/"+ path
      var interval = setInterval(function() {
        this.requester.get(requestsUrl, function(error, response) {
          if (error) { throw new Error('Could not retrieve last request for: '+ path); }

          payload = JSON.parse(response.text || '{}');
          if (payload["last_request"]) {
            clearInterval(interval);
            interval = false;
            callback(payload["last_request"]);
          }
        });
      }, 50);
      setTimeout(function() {
        if (interval) {
          clearInterval(interval);
          var jasmineCurrentEnv =  typeof(jasmine) !== "undefined" ? jasmine.getEnv() : { currentSpec: { description: "" } };
          console.log('\n\nFailed in: ***it => '+ jasmineCurrentEnv.currentSpec.description+ '****\n\n');
          throw new Error('Timed out when retrieving last request for: '+ path);
        }
      }, wait);
  };
};

OptimusPrimeHelper.prototype.requester = Superagent;

module.exports = OptimusPrimeHelper;
