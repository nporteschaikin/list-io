var config = require('./../../config');
var request = require('request');
var url = require('url');

exports.search = function (query, callback) {
  return request.get({
    json: true,
    uri: url.format({
      protocol: 'https',
      host: 'maps.googleapis.com',
      pathname: 'maps/api/place/autocomplete/json',
      query: {
        input: query,
        key: config.google.apiKey
      }
    })
  }, function (error, response, body) {
    if (error || response.statusCode != 200) return callback(new Error(error));
    return callback(null, body.predictions);
  });
};
