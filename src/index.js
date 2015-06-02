var superagent = require("superagent");
var Promise = require('es6-promise').Promise;

var OptimusPrimeResolver = function (path, id) {
  this.path = path;
  this.id = id;
  this.waitFor = 5000;

  this.count = function(path, callback) {
    var requestsUrl = "http://localhost:7011/requests/"+ path + '?_OpID='+ this.id;
    superagent.get(requestsUrl, function(e,r) {
      callback(parseInt(JSON.parse(r.text || '{ count: 0 }')["count"]));
    });
  };

  this.then = function(fn) {
    var path = this.path;
    var primedId = this.id;
    var self = this;

    return new Promise(function (resolve, reject) {
      browser.executeScript('return window.preregBackendUrl;').then(function(originalURL) {
        browser.executeScript('window.preregBackendUrl = "'+ (originalURL+"?_OpID="+ primedId) +'";').then(function () {
          browser.waitForAngular();
          fn(self);
          resolve(true);
        });
      });
    });
  };

  // TODO: Refactor this :)
  this.lastRequestFor = function(path, callback, timeout) {
      var wait = timeout || this.waitFor;
      var requestsUrl = "http://localhost:7011/requests/"+ path + '?_OpID='+ this.id;
      var interval = setInterval(function() {
        superagent.get(requestsUrl, function(error, response) {
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
          throw new Error('Timed out when retrieving last request for: '+ path);
        }
      }, wait);
  };
}

module.exports = function (path) {
  this.merge = function(obj1, obj2) {
    var tmpObj = {}

    for(var property in obj1) {
      if(obj1.hasOwnProperty(property)) {
        tmpObj[property] = obj1[property];
      }
    }

    for(var property in obj2) {
      if(obj2.hasOwnProperty(property)) {
        tmpObj[property] = obj2[property];
      }
    }

    return tmpObj;
  };

  var id = Date.now();
  options = Array.prototype.slice.call(arguments, 1)[0] || {};
  options.content_type = options.content_type ? options.content_type : 'json'

  path = path + '?_OpID='+ id;
  params = this.merge({path_name: path}, options);

  //
  // We need to wait for angular :)
  //
  browser.waitForAngular();

  return new Promise(function (resolve, reject) {
    superagent.post("http://localhost.bskyb.com:7011/prime").
      send(params).
      end(function(error, response) {
        if (error) { reject(false); throw new Error("Could not be primed :("); }
        resolve(new OptimusPrimeResolver(path, id));
      });
  });
};
