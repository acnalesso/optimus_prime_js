var Superagent = require("superagent");
var Promise = require('es6-promise').Promise;

var OptimusPrimeHelper = function (path, id) {
  var requestsUrl = "http://localhost:7011/requests/"+ path;

  this.path = path;
  this.waitFor = 5000;
  this.id = id;


  this.count = function(callback) {
    this.requester.get(requestsUrl, function(e,r) {
      callback(parseInt(JSON.parse(r.text || '{ "count": 0 }')["count"]));
    });
  };

  var interval = function(fn, wait, times) {
    var internalInterval = (function (w, t) {
      return function () {
        if (t === 0) {
          return fn(function (lastRequestForCallback) { lastRequestForCallback({}); });
        }

        if (t-- > 0) {
          setTimeout(internalInterval, w);
        }
      };
    })(wait, times);

    internalInterval();
  };


  this.lastRequestFor = function(callback, timeout) {
      var wait = timeout || this.waitFor;
      var requester = this.requester;

      //
      // nextTick is responsible for setting another timeout in this case
      // it gets called when the payload['last_request'] is empty.
      // We pass the callback to it as this callback gets called in the last attempt
      // to wait for the last request.
      interval(function (nextTick) {
        requester.get(requestsUrl, function(error, response) {
          if (error) { throw new Error('Could not retrieve last request for: '+ path); }

          var payload = JSON.parse(response.text === 'null' ? '{}' : response.text);

          if (payload["last_request"]) {
            callback(payload["last_request"]);
          } else {
            nextTick(callback);
          }
        });
      }, wait, 3);
  };
};

OptimusPrimeHelper.prototype.requester = {
  get: Superagent.get
};

module.exports = OptimusPrimeHelper;
