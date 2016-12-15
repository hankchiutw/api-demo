'use strict';

/**
 * Decorate res object with logging, etc
 */
module.exports = function(req, res, next){
    res.ok = ok;
    next();
};

/**
 * Response 200 and logical succeed
 */
function ok(obj){
    logger.simple("res OK: ", obj);
    this.send(obj);
}
