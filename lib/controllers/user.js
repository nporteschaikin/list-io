var Models = require('./../models');

var findAll = exports.findAll = function (params, callback) {
  var conditions = {};
  return Models.User
    .find(conditions)
    .exec(callback);
}

var findById = exports.findById = function (id, callback) {
  return Models.User
    .findById(id)
    .exec(callback);
}

var edit = exports.edit = function (user, params, callback) {
  var attributes = {
    coverPhoto: params.coverPhoto,
    profilePicture: params.profilePicture,
    bio: params.bio
  };
  user.set(attributes);
  return user.save(function (error, user) {
    return callback(error, user);
  });
}
