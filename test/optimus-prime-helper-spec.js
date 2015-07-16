var OptimusPrimeHelper = require('../src/optimus-prime-helper');
var sinonChai = require('sinon-chai');
var expect = require('chai').use(sinonChai).expect;
var sinon = require('sinon');

describe('Optimus Prime', function () {

  var response, requester;
  beforeEach(function () {
    response = null;
  });

  requester = {
    get: function (url, fn) { fn(null, { text: response });  }
  };

  it('keeps track of the generated id', function () {
    helper = new OptimusPrimeHelper('endpoint', 'id-here');
    expect(helper.id).to.eq('id-here');
  });

  describe('count', function () {
    it('returns 0 when no requests have been made to an endpoint', function () {
      var amount = 0;
      var helper = new OptimusPrimeHelper('endpoint');
      helper.requester = requester;

      helper.count(function (n) { amount = n; });
      expect(amount).to.eq(0);
    });

    it('returns number of requests made to an endpoint', function () {
      var amount = 0;
      var helper = new OptimusPrimeHelper('endpoint');
      helper.requester = requester;
      response = '{ "count": 1 }';

      helper.count(function (n) { amount = n; });
      expect(amount).to.eq(1);
    })
  });

  describe('lastRequest', function () {

    it('times out then calls the function passed to lastRequest', function (done) {
      helper = new OptimusPrimeHelper('endpoint');
      helper.waitFor = 10;
      response = '{ "last_request": null }';
      helper.requester = requester;

      helper.lastRequest(function (lastRequest) {
        expect(JSON.stringify(lastRequest)).to.eq('{}');
        done();
      });
    });

    it('does not time out when last request response is fulfilled', function (done) {
      helper = new OptimusPrimeHelper('endpoint');
      helper.waitFor = 10;
      response = '{ "last_request": null }';
      helper.requester = requester;

      setTimeout(function () {
        response = '{ "last_request": { "name": "Antonio" } }';
      }, 5);

      helper.lastRequest(function (lastRequest) {
        expect(lastRequest.name).to.eq('Antonio');
        done();
      });
    });

  });
});
