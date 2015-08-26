var Models = require('./../models');
var config = require('./../config');
var utils = require('./../utils');
var OAuth = require('oauth');
var _ = require('lodash');

exports.init = function (request, response, next) {

  /*
   * Find session token in header.
   */

  var token;
  if (token = request.headers.token) {
    return utils.session.get(token, function (error, userId) {

      // if there's an error, move on.
      if (error) return next(error);

      // otherwise, find use by user id.
      return Models.User.findById(userId, function (error, user) {

        // Set request params.
        request.sessionUser = user;
        request.sessionToken = token;

        // Move on.
        return next(error);

      });
    });
  }

  /*
   * If there's no token, move on.
   */

  return next();

}

exports.verify = function (request, response, next) {

  /*
   * If session user doesn't exist, send 401.
   * Otherwise, move on.
   */

  if (!request.sessionUser) return response.status(401).end();
  return next();

}

exports.create = function (request, response, next) {
  var params = request.body;
  var oauth;

  /*
   * Create a callback.
   */

  var callback = function (error, query, attributes) {

    // if error, move on.
    if (error) return next(error);

    // Otherwise, create the user.
    return findOrCreateUser(query, attributes, function (error, user) {

      // if error or no user, move on.
      if (error || !user) return next(error);

      // Set the session.
      return utils.session.set(user.id, function (error, sessionToken) {

        // add to request object;
        request.user = user;
        request.sessionToken = sessionToken;

        // move on.
        return next(error);

      });

    });

  }

  /*
   * Facebook strategy.
   */

  var facebookAccessToken;
  if (facebookAccessToken = params.facebookAccessToken) {
    oauth = new OAuth.OAuth2(config.facebook.clientId, config.facebook.clientSecret);
    return oauth.get('https://graph.facebook.com/me', facebookAccessToken, function (error, json) {

      // If there's an error, just run the callback.
      if (error) return callback(error);

      // Parse JSON.
      var fbUser = JSON.parse(json);

      // Build query.
      var query = {
        facebookId: fbUser.id,
      }

      // Attributes.
      var attributes = {
        displayName: fbUser.name
      }

      // return callback
      return callback(null, query, attributes);

    });
  }

  /*
   * Session token strategy.
   */

  var sessionToken;
  if (sessionToken = request.body.sessionToken) {
    return utils.session.get(sessionToken, function (error, userId) {

      // If there's an error, just run the callback.
      if (error) return callback(error);

      // Build query.
      var query = {
        _id: userId
      }

      // return callback
      return callback(null, query);

    });
  }

  /*
   * If we got nothing, we move on.
   */

  return next();

}

exports.delete = function (request, response, next) {

  /*
   * Unset session token.
   */

  return utils.session.unset(request.sessionToken, next);

}

exports.aps = function () {

  /*
   * Add Apple Push Notification service token.
   */

  return utils.aps.addToken(request.sessionUser, token, next);

}

/*
 * @function for finding or creating a user.
 */

function findOrCreateUser(query, attributes, callback) {

  /*
   * Try to find a user by the query.
   */

  return Models.User
    .findOne(query)
    .exec(function (error, user) {

      // If error occured, move on.
      if (error) return callback(error);

      // if an ID was passed, callback with nothing.
      if (query.id && !user) return callback();

      // If we have no user at this point, create a user
      // and run callback.

      if (!user) return Models.User.create(_.extend(query, attributes), callback);

      // Otherwise, run callback with user.
      return callback(null, user);

    });
}
