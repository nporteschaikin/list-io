var env = require('./env');
var colors = require('colors');

var log = module.exports = function (message) {
  if (env.isDevelopment) {
    console.log(message);
  }
}

log.error = function (error) {
  console.log(error);
}
