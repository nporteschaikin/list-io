var config = require('./../config')
var req = require('request');
var url = require('url');
var _ = require('lodash');

/*
 * Search venues.
 */

exports.searchVenues = function (params, callback) {
  return request('GET', 'venues/search', {
    ll: params.latitude + ',' + params.longitude,
    query: params.query
  }, function (error, response) {
    if (error) return callback(error);
    return callback(null, response.venues);
  });
}

/*
 * Generic request to Foursquare's API.
 */

var request = function (method, path, params, callback) {
  return req[method.toLowerCase()]({
    uri: url.format({
      protocol: 'https',
      host: 'api.foursquare.com/v2',
      pathname: path,
      query: _.extend({
        client_id: config.foursquare.clientId,
        client_secret: config.foursquare.clientSecret,
        v: config.foursquare.versionDate
      }, params)
    }),
    json: true
  }, function (error, response, body) {
    if (error) return callback(error);
    return callback(null, body.response);
  });
}
