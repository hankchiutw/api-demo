'use strict';

global.logger = require('lib/logger');

const dev = require('./env/dev');
const prod = require('./env/prod');

/**
 * Default configurations
 * Will be overwrote by env specified settings
 */
const defaults = {
    apiPath: '/api/v1'
};

/**
 * Merge env settings to defaults
 */
let ret = { dev, prod }[process.env.NODE_ENV || 'dev'];
ret = Object.assign({}, defaults, ret);

ret.hostUrl = 'http://'+ret.host+':'+ret.port;
ret.apiUrl = ret.hostUrl+ret.apiPath;
ret.publicApiUrl = ret.publicHostUrl+ret.apiPath;

/**
 * Expose config object
 */
module.exports = ret;
