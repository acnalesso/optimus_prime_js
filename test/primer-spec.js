var sinonChai = require('sinon-chai');
var expect = require('chai').use(sinonChai).expect;
var sinon = require('sinon');
var prime = require('../src/primer');

describe('Primer', function () {
  var url, params, error, response, path, waitedForAngular = false;
  var mockedOptimusPrimeHelper = sinon.spy(prime, 'OptimusPrimeHelper');

  beforeEach(function () {
    prime.OptimusPrimeHelper.reset();
    error = undefined;
    url = undefined;
    path = undefined;
    params = undefined;
    waitedForAngular = false;
  });

    prime.requester = sinon.stub(prime.requester, "post", function(mockServerURL) {
      url = mockServerURL;
      return {
        send: function (mockParams) {
          params = mockParams;
          return {
            end: function(callback) {
              callback(error);
            }
          };
        }
      };
    });

    it('sends a post request to optimus prime mock server', function () {
      prime('endpoint', {}, function () {});
      expect(url).to.equal('http://localhost.bskyb.com:7011/prime');
    });

    it('returns an instance of OptimusPrimeHelper when primed with a callback function', function () {
      var op;
      prime('endpoint', {}, function (_op_) { op = _op_; });
      expect(op).to.be.a('object');
    });

    it('sends params when priming', function () {
       prime('test', {response: ''}, function () {});
       expect(params.toString()).to.equal({ path_name: 'test?_OpID=', response: '', content_type: 'json' }.toString());
    });

    it('throws an error if it could not primed', function () {
       error = {};
       expect(function () {
       prime('endpoint', {}, function() {});
       }).to.throw(Error);
    });

    it('does not generate an id when no callback is given', function () {
       var primed = prime('endpoint', {});
       expect(primed.path).to.eq('endpoint');
       expect(primed.id).to.eq('');

    });

});
