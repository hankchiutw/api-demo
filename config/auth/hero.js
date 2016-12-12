'use strict';

const cn = require('co-nextware');
const CustomStrategy = require('passport-custom').Strategy;

/**
 * Expose
 */

module.exports = new CustomStrategy(cn(check));

/**
 * Implements
 */

function *check(req, done){
    // verify

    // return error
    //return done('errorMessage');
    
    // return success
    return done(null, {});

}
