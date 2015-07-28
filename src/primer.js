var superagent = require('superagent');
var OptimusPrimeHelper = require('./optimus-prime-helper');

var Primer = function (path, options, callback) {

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

  superagent.post(Primer.host + "/prime").
    send(params).
    end(function(error) {
      if (error) { throw new Error("Could not be primed :("); }
      if (callback) { callback(new Primer.OptimusPrimeHelper(path, id, Primer.host)); }
    });
    return new Primer.OptimusPrimeHelper(path, id, Primer.host);
};

Primer.lastRequestFor = function (path, callback, times) {
  var id = path.match(/\?_OpID=(.*)/)[1];
  (new Primer.OptimusPrimeHelper(path, id, Primer.host)).lastRequest(callback, times)
};

Primer.requester = superagent;
Primer.OptimusPrimeHelper = OptimusPrimeHelper;
Primer.host = "http://localhost.bskyb.com:7011";
module.exports = Primer;
