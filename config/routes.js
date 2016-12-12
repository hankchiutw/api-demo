'use strict';

const config = require('config/config');
const errorHandler = require("config/middlewares/errorHandler");

/**
 * Expose
 */

module.exports = function(app, auth){
    console.log('Config routes ...');

    app.use(auth.initialize());

/**
 * Routes
 */

    app.get(`${config.apiPath}/hello`, function(req, res){ res.ok('ok');});

    app.use(`${config.apiPath}/heroes`, require('app/routes/hero')(app, auth));

/**
 * Error handlers
 */

    app.use(errorHandler.clientErrorHandler);
};
