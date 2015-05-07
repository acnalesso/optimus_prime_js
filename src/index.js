require("shelljs/global");
var superagent = require("superagent");

module.exports = {
  waitFor: 1000,
  merge: function(obj1, obj2) {
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
  },

  count: function(path, callback) {
    var requestsUrl = "http://localhost:7011/requests/"+ path;
    superagent.get(requestsUrl, function(e,r) {
      callback(parseInt(JSON.parse(r.text || '{ count: 0 }')["count"]));
    });
  },

  prime: function(path) {
    options = Array.prototype.slice.call(arguments, 1)[0] || {};
    options.content_type = options.content_type ? options.content_type : 'json'
    params = this.merge({path_name: path}, options);

    superagent.post("http://localhost.bskyb.com:7011/prime").
      send(params).
      end(function(error, response) {
        if (response.status === 404) { throw new Error("Could not be primed :("); }
      });
  },

  // TODO: Refactor this :)
  lastRequestFor: function(path, callback) {
     var requestsUrl = "http://localhost:7011/requests/"+ path;
     var count = 0;
     var fn = function() {
        clearInterval(interval);
        if (count > this.waitFor) { new Throw('request has not been made'); }

        superagent.get(requestsUrl, function(error, response) {
            if (error) { throw new Error('Could not retrieve last request for: '+ path); }

            payload = JSON.parse(response.text || '{}');
            if (payload["last_request"]) {
                if (callback(payload["last_request"])) { return true; };
                count += 3;
                interval = setInterval(fn, 3);
            }
       });
     }

     var interval = setInterval(fn, 3);
    }
};
