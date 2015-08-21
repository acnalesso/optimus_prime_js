var superagent = require('superagent');
var OptimusPrimeHelper = require('./optimus-prime-helper');
var Primer = function (path, options, callback) {
var Promise = require('es6-promise').Promise;

  var merge = function(obj1, obj2) {
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

  var id = typeof(callback) === "function" ? Date.now() + '-' + parseInt(Math.random(Date.now()) * 10000) * 10 : '';

  if (options === undefined) { options = {}; }
  options.content_type = options.content_type ? options.content_type : 'json'

  path = (id === '' ? path : path +'?_OpID='+ id);
  params = merge({path_name: path}, options);

  return new Promise(function (resolve, reject) {
    superagent.post(Primer.host + "/prime").
      send(params).
      end(function(error) {
        if (error) { reject(Error("Could not be primed :(")); }
        if (callback) { callback(new Primer.OptimusPrimeHelper(path, id, Primer.host)); }
        resolve();
      });
  });
};

Primer.lastRequestFor = function (path, callback, times) {
  var id, matched = path.match(/\?_OpID=(.*)/);
  if (matched) { id = matched[1]; }
  (new Primer.OptimusPrimeHelper(path, id, Primer.host)).lastRequest(callback, times)
};

Primer.countFor = function (path, callback) {
  (new Primer.OptimusPrimeHelper(path, '', Primer.host)).count(callback)
};

Primer.purge = function () {
  return new Promise(function (resolve, reject) {
    superagent.get(Primer.host + "/purge").send({}).
      end(function(error) {
        if (error) { reject(Error("Could not be purged :(")); }
        resolve();
      });
  });
};

Primer.requester = superagent;
Primer.OptimusPrimeHelper = OptimusPrimeHelper;
Primer.host = "http://localhost.bskyb.com:7011";
module.exports = Primer;
