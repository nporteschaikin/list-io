var Models = require('./../models');
var config = require('./../config');
var middleware = require('./../middleware');
var utils = require('./../utils');
var OAuth = require('oauth');
var _ = require('lodash');

module.exports = function (app) {

  app.post('/auth', function (request, response) {

    var authCallback = function (error, attributes, updateAttributes, createAttributes) {
      if (error) return next(error);
      if (!attributes) return response.status(401).end();

      /*
       * Find or create user.
       */

      return Models.User.findOne(attributes).exec(function (error, user) {
        if (error) return next(error);

        /*
         * If there is no user and ID was specified,
         * return unauthorized response.
         */

        if (!user && attributes._id) return response.status(401).end();

        /*
         * If there is no user matching `attributes`,
         * create one.
         */

        if (!user) {
          return Models.User.create(_.extend(attributes, updateAttributes, createAttributes), userCallback);
        }

        /*
         * Otherwise, just update the user's attributes
         * and return the user.
         */

        return user.update(updateAttributes, function (error) {
          return userCallback(error, user);
        });

      });
    };

    var userCallback = function (error, user) {
      if (error) return response.status(500).end();
      return utils.session.set(user._id, function (error, sessionToken) {
        if (error) return response.status(500).end();
        return response.json({
          user: user,
          sessionToken: sessionToken
        });
      });
    }

    if (request.body.sessionToken) {

      /*
       * Handle native access token.
       */

      var sessionToken = request.body.sessionToken;
      return utils.session.get(sessionToken, function (error, uid) {
        return authCallback(error, { _id: uid });
      });

    } else if (request.body.facebookAccessToken) {

      /*
       * Handle Facebook access token.
       */

      var accessToken = request.body.facebookAccessToken;
      var oauth = new OAuth.OAuth2(config.facebook.clientId, config.facebook.clientSecret);
      return oauth.get('https://graph.facebook.com/me', accessToken, function (error, body) {
        if (error) return callback(error);
        var facebookAttributes = JSON.parse(body);

        /*
         * By default, use FB profile picture.
         */

        return utils.facebook.getProfilePictureUrl(facebookAttributes.id, function (err, url) {

          /*
           * Ignore error here if there is one.
           */

          return authCallback(error, {

            /*
             * Matching attributes.
             */

            facebookId: facebookAttributes.id

          }, {

            /*
             * Attributes to update and create with.
             */

            displayName: facebookAttributes.name

          }, {

            /*
             * Attributes to only create with.
             */

            profilePictureUrl: url

          });

        });

      });

    }

    return response.status(401).end();

  });

  app.delete('/auth', middleware.auth.verify, function (request, response) {

    /*
     * Unset session token.
     */

    return utils.session.unset(request.sessionTokenToken, function (error) {
      if (error) return next(error);
      return response.status(200).end();
    });

  });

  app.post('/auth/aps', middleware.auth.verify, function (request, response) {

    /*
     * Save iOS device.
     */

    return utils.aps.addToken(request.sessionUser, request.body.deviceToken, function (error) {
      if (error) return next(error);
      return response.status(200).end();
    });

  });

};
