'use strict';

const rp = require('request-promise');
const assert = require('chai').assert;

const apiUrl = require('config/config').publicApiUrl;
const api = require('chai-api')(apiUrl);

const mockUrl = require('config/config').mockUrl;
const mockApi = require('chai-api')(mockUrl);

/** hero api tests */
module.exports = function(){
    describe(`>>${__filename}`, function(){
        let mock = {};

        before(function*(){
            mock.heroes = yield mockApi('GET', '/heroes');
        });

        // req object for each tests
        beforeEach(function(){
            this.authHeaderOk = { name: 'hahow', password: 'rocks' };
            this.authHeaderFail = { name: 'hahow', password: 'rockss' };
            this.authHeaderIgnore = { name1: 'hahow', password: 'rocks' };
        });

        // remove created data
        after(function*(){
        });

        /**
         * sub tests
         */

        describe('#list', function(){
            it('should get public list', function*(){
                const req = {};
                const ret = yield api('GET', '/heroes', req);
                assert.isOk(ret, 'results should be defined');

                assert.deepEqual(ret, mock.heroes, 'results should equal to mock data');
            });
        });

        describe.skip('#secret list', function(){
            it('should get secret list', function*(){
                const req = { headers: this.authHeaderOk };
                const ret = yield api('GET', '/heroes', req);
                assert.isOk(ret, 'results should be defined');
            });
        });

    });

};

