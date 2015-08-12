var config = require('./config');
var log = require('./log');
var mongoose = require('mongoose');

var connection = module.exports = mongoose.createConnection(config.mongo.url);
connection.on('error', log.error);
