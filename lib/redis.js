var config = require('./config');
var redis = require('redis');

var client = module.exports = redis.createClient(config.redis.port, config.redis.host);
if (config.redis.auth) client.auth(config.redis.auth);
