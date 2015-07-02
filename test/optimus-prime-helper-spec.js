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
});
