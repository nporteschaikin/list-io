var Models = require('./../models');

/*
 * @function Find all users.
 */

exports.findAll = function (request, response, next) {
  return Models.User.find({}).exec(function (error, users) {
    if (error) return next(error);
    response.users = users;
    return next();
  });
}

/*
 * @function Find one user by ID.
 */

exports.findById = function (request, response, next) {
  return Models.User.findById(request.params.id).exec(function (error, user) {
    if (error) return next(error);
    response.user = user;
    return next();
  });
}

/*
 * @function Update session user.
 */

exports.update = function (request, response, next) {
  var user = request.sessionUser;
  var params = request.body;

  /*
   * Create update attributes.
   */

  var attrs = {
    coverPhoto: params.coverPhoto,
    profilePicture: params.profilePicture,
    bio: params.bio
  };

  /*
   * Create update attributes.
   */

  user.set(attrs);

  /*
   * Create update attributes.
   */

  return user.save(function (error) {
    if (error) return next(error);
    response.user = user;
    return next();
  });

}
