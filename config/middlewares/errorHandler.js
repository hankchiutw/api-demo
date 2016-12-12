'use strict';


/**
 * Expose
 */

exports.clientErrorHandler = function (err, req, res, next) {
    logger.error('clientErrorHandler:', err.stack || err);

};
