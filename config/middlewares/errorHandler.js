'use strict';


/**
 * Expose
 */

exports.clientErrorHandler = function (err, req, res, next) {
    logger.error('clientErrorHandler:', err.name , err.stack || err);

    if(err.message == 'Backend error') return res.send('http://hahow-recruit.herokuapp.com/ temporarily fail');
    if(err.name == 'StatusCodeError') return res.status(err.statusCode).send(err.message);
    return res.status(500).send(err);
};
