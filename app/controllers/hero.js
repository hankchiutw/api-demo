'use strict';

const cn = require('co-nextware');
const config = require('config/config');
const rp = require('request-promise');

/**
 * Expose
 */

module.exports = {
    list: cn(list),
    oneById: cn(oneById)
};

function *list(req, res, next){
    logger.info('heroController: list:');
    let ret, options;

    // secret list
    if(req.headers.name && req.headers.password){
        options = {
            method: 'POST',
            uri: `${config.mockUrl}/auth`,
            json: true,
            body: {
                name: req.headers.name,
                password: req.headers.password
            }
        };
        ret = yield rp(options);

        // fetch secret data
    }
    // public list
    else{
        options = {
            method: 'GET',
            uri: `${config.mockUrl}/heroes`,
            json: true
        };
        ret = yield rp(options);
    }

    res.ok(ret);
}

function *oneById(req, res, next){

    res.ok('hi');
}
