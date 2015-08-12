var config = require('./../config.json');
var env = require('./env');
var _ = require('lodash');

module.exports = _.extend(config.base || {}, config[env.name]);
