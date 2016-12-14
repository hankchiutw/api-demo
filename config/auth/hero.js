'use strict';

const cn = require('co-nextware');
const CustomStrategy = require('passport-custom').Strategy;
const Hero = require('app/models/hero');

/**
 * Expose
 */

module.exports = new CustomStrategy(cn(check));

/**
 * Implements
 */

function *check(req, done){
    if(!req.headers.name || !req.headers.password) return done(null, {});

    logger.info('heroAuth: do verify');
    // verify
    const ret = yield Hero.doAuth(req.headers.name, req.headers.password);
    req.isVerified = true;
    // return error
    //return done('errorMessage');
    
    // return success
    return done(null, {});

}
