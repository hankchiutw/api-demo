'use strict';

const config = require('config/config');
const rp = require('request-promise');

/** class definition */
class Hero{
    constructor(params){
        const self = this;
        Object.defineProperty(self, 'json', {
            value: params
        });

    }

    /**
     * Fetch and expand field data
     */
    *populate(field){
        const self = this;
        logger.info('hero.populate:', `/heroes/${self.json.id}/${field}`);
        self.json.profile = yield _fetchPublic(`/heroes/${self.json.id}/${field}`);
        return self;
    }
}

/** static methods */
Hero.newInstance = newInstance;
Hero.find = find;
Hero.findOneById = findOneById;
Hero.doAuth = doAuth;

module.exports = Hero;

/**
 * Hero factory
 * @param {string} params.id
 */
function newInstance(params){
    const hero = new Hero(params);

    return hero;
}

/**
 * TODO: filtering API
 * @param {boolean} params.isSecret Default false if not set
 */
function *find(){
    const results = yield _fetchPublic('/heroes');

    let ret = [];
    results.forEach( item => {
        ret.push(Hero.newInstance(item));
    });

    _decorateArray(ret);

    return ret;
}

/**
 * @param {string} id
 */
function *findOneById(id){
    const item = yield _fetchPublic(`/heroes/${id}`);
    if(item.id === undefined) throw(item);

    const ret = Hero.newInstance(item);
    return ret;
}

/**
 * Do authentication
 * @param {string} name
 * @param {string} password
 * @return {Promise}
 */
function doAuth(name, password){
    // authenticate API
    const options = {
        method: 'POST',
        uri: `${config.mockUrl}/auth`,
        json: true,
        body: { name, password }
    };

    logger.info('doAuth:', options);
    return rp(options);
}

/**
 * Fetch public data
 * @private
 * @param {string} path API path with heading slash
 * @return {Promise}
 */
function _fetchPublic(path){
    const options = {
        method: 'GET',
        uri: `${config.mockUrl}${path}`,
        json: true
    };

    logger.info('_fetchPublic:', options);
    return rp(options);
}

/**
 * Decorate array object with methods and properties like Hero class.
 * @param {Array} obj
 */
function _decorateArray(obj){
    if(!Array.isArray(obj)){
        logger.error('_decorateArray: not an Array instance');
        return;
    }

    obj.json = obj.map( item =>  item.json );
    obj.populate = function*(field){
        for(const item of obj){
            yield item.populate(field);
        }
    };
}

