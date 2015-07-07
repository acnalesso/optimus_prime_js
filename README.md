Optimus Prime JS
----------------

It's a javascript driver for Optimus Prime mock server currently compatible with Protractor.

## NOTE: It only works Angular + Protractor at the moment.

## How to use it
  * Install the optimus_prime server <code>gem install optimus_prime</code>
  * Install optimus_prime_js <code>npm install git://github.com/acnalesso/optimus_prime_js</code>
  * start the mock server <code>ruby -r optimus_prime -e 'OptimusPrime::Cannon.fire!(7011)'</code> See optimus_prime repo to find out more.
  * Require optimus_prime_js <code>var prime = require('optimus_prime_js');</code>
  * Now you can prime anything :)

## Priming
```js
  var prime = require('optimus_prime_js');

  // HTTP response status code
  prime('endpoint-here', { status_code: 200 })

  // HTTP Response body
  prime('endpoint-here', { response: { details: { name: 'Papoy' } } })
```

## Priming with a callback
  Whenever you set the url that will be used in a request which will
  be sent to Optimus Prime mock server you need to write the url like so:
  <code>http://host:portNumber/get/path-you-want-to-prime?_OpID=</code>
```js
  //
  // NOTE: When a callback function is passed in, Optimus Prime JS will not generate an ID for this particular endpoint
  //
  // Sample url:
  // => http://host:portNumber/get/:endpointHere?_OpID=:timestamps-:randomNumber
  // => http://localhost:7011/get/posts?_OpID=:321302392-3212
  prime('endpoint-here', {}, function (op) {

    console.log(op.id);

    op.count(function (result) {
      console.log(result);
    })
  });
```

### Retriving the primed id
  When a callback is passed an instance of op is returned so that you can
  interact with that primed state.
```js
  prime('endpoint-here', {}, function (op) {
    console.log(op.id); //=> 1436300268971-81800
  });
```

## TODO:
  * Support different testing frameworks ( It only supports Protractor at the moment )
  * Refactor the code
  * Add more functionalities?
  * Rewrite Optimus Prime mock server in Javascript
  * Support synchronous count and lastRequestFor
