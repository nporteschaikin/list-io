var utils = require('./../utils');

exports.find = function (request, response, next) {

  /*
   * Build query.
   */

  return utils.foursquare.searchVenues(request.query, function (error, venues) {
    if (error) return next(error);
    response.places = venues;
    return next();
  });

}
