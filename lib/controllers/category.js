var Models = require('./../models');

var findAll = exports.findAll = function (params, callback) {
  var conditions = {};

  return Models.Category
    .find(conditions)
    .exec(callback);
}

var findById = exports.findById = function (id, callback) {
  return Models.Category
    .findOne(id)
    .exec(callback);
}

var create = exports.create = function (params, callback) {
  var attributes = {
    name: params.name
  };
  return Models.Category
    .create(attributes, callback);
}

var remove = exports.remove = function (category, callback) {
  return category.remove(callback);
}
