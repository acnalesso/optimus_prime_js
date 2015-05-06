require("shelljs/global");
var superagent = require("superagent");

module.exports = {
  count: function(path, callback) {
    var requestsUrl = "http://localhost:7011/requests/"+ path;
    superagent.get(requestsUrl, function(e,r) {
      callback(e, JSON.parse(r.text)["count"]);
    });
  },

  prime: function(path) {
    options = Array.prototype.slice.call(arguments, 1)[0];
    params = this.merge({path_name: path}, options);

    superagent.post("http://localhost.bskyb.com:7011/prime").
      send(params).
      end(function(error, response) {
        if (response.status === 404) { new Throw("Could not be primed :("); }
      });
  }
};
