'use strict';

const ERROR_CODE_ENUM = {
    400: 'Bad request. Check body parameter and query parameters.',
    401: 'Unauthorized(Authorization header not found or wrong)',
    403: 'Not permitted',
    404: 'Object not found'
};

/**
 * Success and Fail callback
 */

let ret = function(req, res, next){
    res.ok = _ok;
    res.fail = _fail;
    next();
};
ret.fail = _fail;

module.exports = ret;


/**
 * Private implementation
 */

/**
 * Response 200 and logical succeed
 */
function _ok(obj){
    logger.simple("res OK: ", obj);
    this.send(obj);
}

/**
 *
 * Response 200 but logical fail
 * @example
 * {
 *  result: {
 *      isSuccess: false,
 *      errorCode: 450,
 *      errorMessage: '', // for client
 *      errorData: '' // for program
 *  }
 * }
 */
function _fail(obj, code){
    const errorMessage = ERROR_CODE_ENUM[code] ? ERROR_CODE_ENUM[code] : (typeof obj !== 'string' ? JSON.stringify(obj) : obj);
    let ret = {
        result: {
            isSuccess: false,
            errorCode: code || 450,
            errorMessage,
            errorData: obj 
        }
    };
    logger.error("res FAIL: ", ret);
    this.json(ret);
}