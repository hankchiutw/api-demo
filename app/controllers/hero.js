'use strict';

const cn = require('co-nextware');
const Hero = require('app/models/hero');

/**
 * Expose
 */

module.exports = {
    list: cn(list),
    oneById: cn(oneById)
};

/**
 * List data, public or secret
 */
function *list(req, res, next){
    logger.info('heroController: list:');
    let ret;

    ret = yield Hero.find();
    if(req.isVerified) yield ret.populate('profile');

    res.ok(ret.json);
}

/**
 * Get one data, public or secret
 */
function *oneById(req, res, next){
    logger.info('heroController: oneById:', req.params);
    let ret;

    ret = yield Hero.findOneById(req.params.id);
    if(req.isVerified) yield ret.populate('profile');

    res.ok(ret.json);
}

