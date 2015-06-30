var superagent = require('superagent');
var OptimusPrime = require('./optimus_prime');

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

  var id = typeof(callback) === "function" ? '' :  Date.now() + '-' + parseInt(Math.random(Date.now()) * 10000) * 10;

  if (options === undefined) { options = {}; }
  options.content_type = options.content_type ? options.content_type : 'json'

  path = path + '?_OpID='+ id;
  params = merge({path_name: path}, options);

  superagent.post("http://localhost.bskyb.com:7011/prime").
    send(params).
    end(function(error) {
      if (error) { throw new Error("Could not be primed :("); }
      callback(new Primer.OptimusPrime(path));
    });
};

Primer.requester = superagent;
Primer.OptimusPrime = OptimusPrime;
module.exports = Primer;
