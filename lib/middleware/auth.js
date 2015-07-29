var utils = require('./../utils');
var controllers = require('./../controllers');

exports.init = function (request, response, next) {

  var accessToken;
  if (accessToken = request.headers.token) {
    return utils.session.get(accessToken, function (error, uid) {
      if (error) return response.status(500).end();
      return controllers.user.findById(uid, function (error, user) {
        if (error) return response.status(500).end();
        request.user = user;
        request.sessionToken = accessToken;
        return next();
      });
    });
  }

  return next();

}

exports.verify = function (request, response, next) {
  if (!request.user) return response.status(401).end();
  return next();
}
