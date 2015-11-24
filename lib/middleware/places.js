var utils = require('./../utils');

exports.find = function (request, response, next) {

  /*
   * Build query.
   */

  var query = request.query;
  var search = query.query;
  return utils.google.places.search(search, function (error, places) {
    if (error) return next(error);
    response.places = places;
    return next();
  });

}
