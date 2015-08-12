var Models = require('./../models');
var utils = require('./../utils');

exports.init = function (request, response, next) {
  var accessToken;
  if (accessToken = request.headers.token) {
    return utils.session.get(accessToken, function (error, uid) {
      if (error) return response.status(500).end();
      return Models.User.findById(uid, function (error, user) {
        if (error) return response.status(500).end();
        request.sessionUser = user;
        request.sessionTokenToken = accessToken;
        if (next) return next();
        return;
      });
    });
  }
  if (next) return next();
}

exports.verify = function (request, response, next) {
  if (!request.sessionUser) return response.status(401).end();
  if (next) return next();
}
