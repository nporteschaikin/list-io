var Models = require('./../models');

exports.findAll = function (request, response, next) {
  return Models.Category.find({}).exec(function (error, categories) {
    if (error) return next(error);
    request.categories = categories;
    return next();
  });
}

exports.findById = function (request, response, next) {
  return Models.Category.findById(id).exec(function (error, category) {
    if (error) return next(error);
    request.category = category;
    return next();
  });
}

exports.create = function (request, response, next) {
  var params = request.body;
  return Models.Category.create({name: params.name}, function (error, category) {
    if (error) return next(error);
    request.category = category;
    return next();
  });
}

exports.delete = function (request, response, next) {
  return category.remove(function () {
    if (error) return next(error);
    return next();
  });
}
