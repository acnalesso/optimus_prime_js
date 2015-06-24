var sinonChai = require('sinon-chai');
var expect = require('chai').use(sinonChai).expect;
var sinon = require('sinon');
var prime = require('../src/primer');


describe('Primer', function () {
  var url, params, error, response, path;
  var mockedOptimusPrime = sinon.spy(prime, 'OptimusPrime');

  beforeEach(function () {
    prime.OptimusPrime.reset();
    error = undefined;
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

  it('returns an instance of OptimusPrime when primed with a callback function', function () {
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

  it('passes path to the instance created when callback is called', function () {
     prime('endpoint', {}, function() {});
     expect(mockedOptimusPrime).to.have.been.calledWith('endpoint?_OpID=');
  });
});
