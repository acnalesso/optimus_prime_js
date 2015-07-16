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
  <code>http://host:portNumber/get/path-you-want-to-prime</code>
```js
  //
  // Sample url:
  // => http://host:portNumber/get/:endpointHere?_OpID=:timestamps-:randomNumber
  // => http://localhost:7011/get/posts?_OpID=321302392-3212
  prime('endpoint-here', {}, function (op) {

    console.log(op.id); //=> 321302392-3212

    console.log(path); //=> posts?_OpID=321302392-3212

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

### Retriving the path + id
  When a callback is passed an instance of op is returned so that you can
  interact with that primed state.
```js
  prime('endpoint-here', {}, function (op) {
    console.log(path); //=> endpoint-here?_OpID=321302392-3212
  });
```

## Priming without a callback
  Optimus Prime JS will return a instance of OptimusPrimeHelper that has id,path and other properties defined.
```js
  helper = prime('endpoint-here', {});
  helper.path //=> endpoint-here?_OpID=321302392-3212
```


## #lastRequest
  As paths are unique, using a random id, sometimes the front-end may take a while to send the request to optimus prime mock server so this method
tries a 100 times sleeping for 500ms each time until the request has gone through. If it's done trying or the request has been make it just executes the callback.
```js
  prime('endpoint-here', {}, function (o) {
    op.lastRequest(function (response) {
      console.log(response) //=> {...}
    }, 100)
  });
```

## #count
  It counts how many requests have been made to a particular endpoint.
```js
  prime('endpoint-here', {}, function (o) {
    op.count(function (n) {
      console.log(n) //=> {...}
    })
  });
```
## TODO:
  * Refactor the code
  * Add more functionalities?
  * Rewrite Optimus Prime mock server in Javascript?
  * Support synchronous count and lastRequest
