var config = require('./../config');
var redis = require('./../redis');
var uuid = require('uuid');

exports.set = function (value, callback) {
  var key = uuid.v4();
  return redis.set((config.session.prefix + key), value, function (error) {
    return callback(error, key);
  });
}

exports.unset = function (key, callback) {
  return redis.del((config.session.prefix + key), callback);
}

exports.get = function (key, callback) {
  return redis.get((config.session.prefix + key), callback);
}
