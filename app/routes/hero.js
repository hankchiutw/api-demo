'use strict';

const heroController = require('app/controllers/hero');
const router = require('express').Router();

/**
 * Expose
 */

module.exports = function(app, auth){
    console.log('hero routes ...');

/**
 * Routes
 */

    router.get('/', auth.heroAuth, heroController.list);
    router.get('/:id', auth.heroAuth, heroController.oneById);

    return router;
};
