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

## Static priming
  Whenever you set the url that will be used in a request which will
  be sent to Optimus Prime mock server you need to write the url like so:
  <code>http://host:portNumber/get/path-you-want-to-prime?_OpID=</code>
```js
  //
  // NOTE: Pass a callback function. Optimus Prime JS will not generate an ID for this particular endpoint
  //
  // Primed URL example: http://host:portNumber/get/endpoint-here?_OpID=
  prime('endpoint-here', {}, function (op) {
    op.count(function (result) {
      console.log(result);
    })
  });
```

## Parallel priming
```js
  //
  // NOTE: It returns a promise. Optimus Prime JS will generate a unique ID for this endpoint.
  //
  // Primed URL example: http://host:portNumber/get/endpoint-here?_OpID=generatedIdHere
  prime('endpoint-here', {}).then(function (op) {
    op.count(function (result) {
      console.log(result);
    })
  });
```

## Replacing url before request is sent
```js
  //
  // NOTE: It returns a promise. Optimus Prime JS will generate a unique ID for this endpoint.
  //
  // Optimus Prime JS will reassign window.config.backendURL to the same url but with ?_OpID=generatedID
  //
  prime('endpoint-here', { _URLToBeReplaced: 'window.config.backendURL'}).then(function (op) {
    op.count(function (result) {
      console.log(result);
    })
  });
```

## TODO:
  * Support different testing frameworks ( It only supports Protractor at the moment )
  * Refactor the code
  * Add more functionality?
  * Rewrite Optimus Prime mock server in Javascript
