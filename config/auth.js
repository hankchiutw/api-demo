'use strict';

const passport = require("passport");
const heroAuth = require('config/auth/hero');

passport.use('heroAuth', heroAuth);

console.log('Config auth ...');
module.exports = {
    initialize: passport.initialize.bind(passport),
    heroAuth: passport.authenticate('heroAuth')
};
