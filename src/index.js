var superagent = require("superagent");
var Promise = require('es6-promise').Promise;

var OptimusPrimeResolver = function (path, id, URLToBeReplaced) {
  this.path = path;
  this.id = id;
  this.waitFor = 5000;
  this._URLToBeReplaced = URLToBeReplaced;

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
    var _URLToBeReplaced = this._URLToBeReplaced;

    return new Promise(function (resolve, reject) {
      if (_URLToBeReplaced) {
        browser.executeScript('return '+_URLToBeReplaced+';').then(function(originalURL) {
          browser.executeScript(_URLToBeReplaced + '= "'+ (originalURL+"?_OpID="+ primedId) +'";').then(function () {
            browser.waitForAngular();
            fn(self);
            resolve(true);
          });
        });
      } else {
        fn(self);
        resolve(true);
      }
    });
  };

  // TODO: Refactor this :)
  this.lastRequestFor = function(path, callback, timeout) {
      var wait = timeout || this.waitFor;
      var primedId = this.id;
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
          var jasmineCurrentEnv =  jasmine.getEnv();
          console.log('\n\nFailed in: ***it => '+ jasmineCurrentEnv.currentSpec.description+ '****\n\n');
          throw new Error('Timed out when retrieving last request for: '+ path + '?_OpID='+ primedId);
        }
      }, wait);
  };
}

module.exports = function (path, options, callback) {
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

  var id = typeof(callback) === "function" ? '' :  Date.now() + '-' + parseInt(Math.random(Date.now()) * 10000) * 10;
  var URLToBeReplaced = options._URLToBeReplaced;

  if (options === undefined) { options = {}; }
  options.content_type = options.content_type ? options.content_type : 'json'

  path = path + '?_OpID='+ id;
  params = this.merge({path_name: path}, options);

  if (callback) {
    superagent.post("http://localhost.bskyb.com:7011/prime").
      send(params).
      end(function(error, response) {
        if (error) { throw new Error("Could not be primed :("); }
        callback(new OptimusPrimeResolver(path, id));
      });
  } else {

    //
    // We need to wait for angular :)
    //
    if (URLToBeReplaced) { browser.waitForAngular(); }

    return new Promise(function (resolve, reject) {
      superagent.post("http://localhost.bskyb.com:7011/prime").
        send(params).
        end(function(error, response) {
          if (error) { throw new Error("Could not be primed :("); reject(false); }
          resolve(new OptimusPrimeResolver(path, id, URLToBeReplaced));
        });
    });
  }
};
