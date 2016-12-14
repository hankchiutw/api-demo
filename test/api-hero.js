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
            assert.isArray(mock.heroes, 'heroes mock should be an array');

            mock.randomId = Math.ceil(Math.random()*mock.heroes.length);
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
                assert.isArray(ret, 'results should be an array');

                assert.deepEqual(ret, mock.heroes, 'results should equal to mock data');
            });
        });

        describe('#secret list', function(){
            it('should get secret list', function*(){
                this.timeout(3000);
                const req = { headers: this.authHeaderOk };
                const ret = yield api('GET', '/heroes', req);
                assert.isArray(ret, 'results should be an array');

                ret.forEach(item => {
                    assert.property(item, 'profile', 'profile property should be defined');
                });
            });
        });

        describe('#one', function(){
            it('should get one public item', function*(){
                const req = {};
                const ret = yield api('GET', `/heroes/${mock.randomId}`, req);
                assert.isOk(ret.id, 'id should be defined');
            });
        });

        describe('#secret one', function(){
            it('should get one secret item', function*(){
                this.timeout(3000);
                const req = { headers: this.authHeaderOk };
                const ret = yield api('GET', `/heroes/${mock.randomId}`, req);
                assert.isOk(ret.id, 'id should be defined');
                assert.property(ret, 'profile', 'profile property should be defined');
            });
        });

        describe('#unauthorized request', function(){
            it('should get status code 401', function*(){
                this.timeout(5000);
                const req = {
                    method: 'GET',
                    uri: `${apiUrl}/heroes`,
                    headers: this.authHeaderFail
                };
                yield rp(req).then( res => {
                    assert.isOk(false, 'should not get response');
                }, res => {
                    assert.isOk(res, 'should have error response');
                    assert.equal(res.statusCode, 401, 'should have response 401');
                });
            });
        });

    });

};

