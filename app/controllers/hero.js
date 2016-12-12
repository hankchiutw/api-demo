'use strict';

const cn = require('co-nextware');

/**
 * Expose
 */

module.exports = {
    list: cn(list),
    oneById: cn(oneById)
};

function *list(req, res, next){
    let ret = [];

    res.ok(ret);
}

function *oneById(req, res, next){
}
