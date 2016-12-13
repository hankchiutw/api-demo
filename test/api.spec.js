'use strict';

require('mocha-generators').install();

const apiUrl = require('config/config').publicApiUrl;
const assert = require('chai').assert;

const api = require('chai-api')(apiUrl);

/** api tests */
describe(`>>${__filename}`, function(){
    it('API service should be ok', function*(){
        const ret = yield api('GET', '/hello');
        assert.isOk(ret, 'result should be defined');
    });

    /**
     * sub tests
     */

    require('./api-hero')();

});

