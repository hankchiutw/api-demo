# api-demo
Simple API service project using express.js.

### Folder structure
```sh
.
├── app
│   ├── controllers # api implementations
│   ├── routes      # router definitions
│   └── services    # standalone services
├── app.js          # boot and run testing
├── config          # app configurations
│   ├── auth        # authentication libraries(passport)
│   ├── auth.js     # load auth libraries
│   ├── config.js   # basic app settings
│   ├── env         # environment settings(respective)
│   ├── express.js  # setup express
│   ├── middlewares # common middlewares
│   └── routes.js   # load app/routes
├── ecosystem.json  # deployment settings
├── lib             # customized libraries
├── package.json
├── public          # static files location
├── README.md       # this file
├── server          # server side scripts, ex. do migration
├── test            # testing scripts
│   ├── api.spec.js
│   ├── ...
└── test-runner.js  # where testing scripts invoked from
```

### Features
- [pm2](http://pm2.keymetrics.io/) process manager.
- Testing on-the-fly(after deployed) with [mocha](https://mochajs.org/).
- ES6 syntax(generator, etc).
- Customized logger library
- Http request logging by [morgan](https://www.npmjs.com/package/morgan)
- Error handling
- CORS

### Pre-install

```sh
npm install -g mocha pm2 concurrently
```

### Install

```sh
npm install
```

### Development

```sh
npm start # local dev environment
npm run log # show local process logs
```
