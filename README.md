# api-demo
Simple API service project using [express.js][express.js].
[![travis status](https://travis-ci.org/hankchiutw/api-demo.svg?branch=master)](https://travis-ci.org/hankchiutw/api-demo)

### Features
- Execute by [pm2][pm2] process manager.
- API testing with [mocha][mocha].
- ES6 syntax(generator, class etc).
- Customized logger library.
- Http request logging by [morgan][morgan].
- Authenticate by extending [passport-custom][passport-custom].
- Client error handling
- CORS enabled

### Pre-install

```sh
npm install -g mocha pm2
```

### Install

```sh
npm install
```

### Development

```sh
npm start # local dev environment
npm run log # show local process logs
npm test # execute test-runner.js
```

### How it works
Boot from entry point `app.js`. Load configurations from folder `config`. Load routing definitions from `config/routes.js`. API implementations are all in folder `app`.

```sh
# Project structure
.
├── app                     # project implementations
│   ├── controllers
│   │   └── hero.js
│   ├── models
│   │   └── hero.js
│   └── routes
│       └── hero.js
├── config                  # project setup and loaders
│   ├── auth
│   │   └── hero.js
│   ├── env
│   │   ├── dev.js
│   │   └── prod.js
│   ├── middlewares
│   │   ├── cors.js
│   │   ├── errorHandler.js # client error handling
│   │   └── res.js          # decorate res object
│   ├── auth.js             # load authentication libraries
│   ├── config.js           # setup project constants
│   ├── express.js          # setup express app
│   └── routes.js           # load routing definitions
├── lib
│   └── logger.js           # customized logger
├── test
│   ├── api-hero.js         # api testing implements
│   └── api.spec.js         # api testing loader
├── app.js                  # project entry point
├── ecosystem.json          # pm2 config
├── package.json
├── README.md               # this file
└── test-runner.js          # load testing scripts

```

##### API authentication flow
For each API route, an authentication middleware is used(`config/auth.js`). If `Name` and `Password` HTTP headers are defined, the server sends a request to pre-provided authentication API to do authentication.

Unauthorized request will be treated as a client error and can be handled in `config/middlewares/errorHandler.js`.

##### Client error handling flow
Each time an API error happened, it will be caught internally in [co-nextware][co-nextware] and throwed by express.js protocol `next(err)`. Finally the error was passed to `config/middlewares/errorHandler.js`.

##### Class Hero as a data model
Defined in `app/models/hero.js`. Inspired from [mongoose](mongoose) API. Each data fetched from pre-provided API will be represented as a `Hero` instance.

- Instance properties
  ###### {Object} hero.json
  > Non-enumerable property to store the raw data.

- Instance methods
  ###### {Generator} hero.populate(field)
  > A generator to fetch data and append to `hero.json[field]`.

- Static methods
  ###### {Function} Hero.newInstance(params)
  > An instance factory.
  
  ###### {Generator} Hero.find()
  > Fetch data from pre-provided API.
  
  ###### {Generator} findOneById(id)
  > Fetch one data from pre-provided API.
  
  ###### {Generator} doAuth()
  > Request authentication API.

### Libraries
*Project structure*
- [express.js][express.js]

  RESTful API routing.

- [pm2][pm2]

  Process management tool to start/stop/watch the node.js app.

- [morgan][morgan]

  As an [express.js][express.js] middleware to log each HTTP request.

*Testing*
- [mocha][mocha]

  As a testing loader.

- [mocha-generators][mocha-generators]

  Enhance [mocha][mocha] with generators enabled. Handy for asynchronous testing.

- [chai][chai]

  Assertion utility for testing.
 
- [chai-api][chai-api]

  Small snippets wrapping [request-promise][request-promise] for API testing.

*Async request*
- [co][co]

  Executing generators in `Promise` manner. Hide `iterator.next()` for client.

- [co-nextware][co-nextware]

  Small snippets wrapping [co][co] with [express.js][express.js] `next()` protocol. Do error handling for generators in [express.js way](http://expressjs.com/en/guide/error-handling.html).

- [request-promise][request-promise]

  HTTP client in `Promise` manner instead of [request][request](callback manner).

*Authentication framework*
- [passport][passport]

  As an [express.js][express.js] middleware to do authentication in a structure and extensible way.

- [passport-custom][passport-custom]

  Define your own authentication strategy for [passport][passport].

### Issues
- Performance data population

  Multiple requests are needed to produce secret data for client. It's better to send requests in a bunch(as `Promise.all`) rather than `yield` one-by-one.
  ```js
  // app/models/hero.js
  // better
  yield Promise.all([/** Promises to populate data */]);

  // poor
  Loop all items{
    yield PromiseToPopulateData;
  }
  ```

- API authentication as a middleware

  Do authentication in a middleware and set a flag if verified. Avoid duplicated and pruning code in controllers.
  ```js
  // app/controllers/hero.js
  // better
  function *list(req, res, next){
    /** produce public data */
    /** produce secret data if it's a verified request */
  }

  function *oneById(req, res, next){
    /** produce public data */
    /** produce secret data if it's a verified request */
  }

  // poor
  function *list(req, res, next){
    if(req.headers.name && req.headers.password){
        /** produce public data */
        /** produce secret data */
    }else{
        /** produce public data */
    }
  }

  function *oneById(req, res, next){
    if(req.headers.name && req.headers.password){
        /** produce public data */
        /** produce secret data */
    }else{
        /** produce public data */
    }
  }
  ```
  
- `Calling "done" of undefined` error in [co][co]
  
  Although the app still works, but it's pruning. When `yield` or `return`, a generator internally called `iterator.next()` and got `{value: someValue, done: Boolean}`. If an `undeinfed` is returned, this redundant error will be invoked. Always ensure what you `yield` or `return` in generators. Carfully use generators, sometimes it's not easy to debug.
  ```js
  // config/auth/hero.js
  function *check(req, done){
    if(!req.headers.name || !req.headers.password){
        done(null, {}); // returned value is undefined
        return {};  // safely return an object

        // work but pruning if do:
        // return done(null, {});
    }
    ...
  }
  ```

- Handle 400 or 401 status code

  Instead of just returning 400 or 401 response to client, an handled message is sent.
  ```js
  // config/middlewares/errorHandler.js
    if(err.name == 'StatusCodeError') return res.status(err.statusCode).send(err.message);
  ```

- Unexpected heroku server fail
  
  Sometimes `{code: 1000, message: "Backend error"}` is got from heroku server instead of JSON data. Handle for this and return meaningful message to client. Also, set testing retries when fail.
  ```js
  // config/middlewares/errorHandler.js
    if(err.message == 'Backend error') return res.send('http://hahow-recruit.herokuapp.com/ temporarily fail');
  ```

### Guideline for code comments
Follow [jsdoc][jsdoc] style.
- Class definition
- API function definition
- Single line and complex code
- Structure explaination

### References
- [Generator][Generator]
- [Iterator][Iterator]


[Generator]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/function*
[Iterator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterator


[jsdoc]: http://usejsdoc.org/
[api-seed]: https://github.com/hankchiutw/api-seed
[mongoose]: http://mongoosejs.com/docs/

[express.js]: https://github.com/expressjs/express
[pm2]: http://pm2.keymetrics.io/
[morgan]: https://www.npmjs.com/package/morgan

[co]: https://github.com/tj/co
[co-nextware]: https://github.com/hankchiutw/co-nextware
[request-promise]: https://github.com/request/request-promise
[request]: https://github.com/request/request

[passport]: https://github.com/jaredhanson/passport
[passport-custom]: https://github.com/mbell8903/passport-custom

[mocha]: https://mochajs.org/
[mocha-generators]: https://github.com/vadimdemedes/mocha-generators
[chai]: http://chaijs.com/api/assert/
[chai-api]: https://github.com/hankchiutw/chai-api
