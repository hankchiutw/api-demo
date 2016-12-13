'use strict';

const cn = require('co-nextware');
const config = require('config/config');
const rp = require('request-promise');
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

    if(req.headers.name && req.headers.password){
        yield Hero.doAuth(req.headers.name, req.headers.password);
        ret = yield Hero.find();
        yield ret.populate('profile');
    }else
        ret = yield Hero.find();

    res.ok(ret.json);
}

/**
 * Get one data, public or secret
 */
function *oneById(req, res, next){
    logger.info('heroController: oneById:', req.params);
    const id = req.params.id;
    let ret;

    if(req.headers.name && req.headers.password){
        yield Hero.doAuth(req.headers.name, req.headers.password);
        ret = yield Hero.findOneById(id);
        yield ret.populate('profile');
    }else
        ret = yield Hero.findOneById(id);

    res.ok(ret.json);
}

