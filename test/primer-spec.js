var sinonChai = require('sinon-chai');
var expect = require('chai').use(sinonChai).expect;
var sinon = require('sinon');
var prime = require('../src/primer');


describe('Primer', function () {

  var url, params;
  prime.requester = sinon.stub(prime.requester, "post", function(mockServerURL) {
    url = mockServerURL;
    return {
      send: function (mockParams) {
        params = mockParams;
        return {
          end: function(callback) {
            callback();
          }
        };
      }
    };
  });

  it('sends a post request to optimus prime mock server', function () {
    prime('endpoint', {}, function () {});
    expect(url).to.equal('http://localhost.bskyb.com:7011/prime');
  });

  it('primes with a callback function', function () {
    var called = false;
    prime('endpoint', {}, function () { called = true; });
    expect(called).to.equal(true);
  });
});
