'use strict';

const config = require('config/config');
const fail = require('config/middlewares/res').fail;

/**
 * Expose
 */

exports.clientErrorHandler = function (err, req, res, next) {
    res.fail = fail;

    if(err.stack) logger.error('clientErrorHandler:', err.stack);

    if(res.headersSent) return next(err);
    if(typeof err === 'string') res.fail(err);
    if(typeof err === 'object') res.fail(err.message, err.code);
};
