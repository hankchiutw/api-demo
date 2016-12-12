'use strict';

const apiUrl = require('config/config').publicApiUrl;
const assert = require('chai').assert;
const api = require('chai-api')(apiUrl);

/** hero api tests */
module.exports = function(mock){
    describe(`>>${__filename}`, function(){
        // req object for each tests
        beforeEach(function(){
        });

        // remove created data
        after(function*(){
        });

        /**
         * sub tests
         */

        describe('#list', function(){
            it('should successfully list', function*(){
                const req = {};
                yield api.success('GET', '/heroes', req);
            });
        });

    });

};

