var Models = require('./../models');

/*
 * @function Run a reverse geocode, returning a plcemark.
 */

exports.findOrCreateByCoordinates = function (request, response, next) {
  var params = request.query;
  var coordinates = [params.longitude, params.latitude];

  /*
   * First, see if a placemark already
   * exists for these coordinates.
   */

  return Models.Placemark.findOne({coordinates: coordinates}, function (error, placemark) {

    /*
     * If we found one, just set it
     * to the contextual object and
     * move on.
     */

    if (placemark) {
      request.placemark = placemark;
      return next();
    }

    /*
     * Otherwise, create one.
     */

    return Models.Placemark.create({coordinates: coordinates}, function (error, placemark) {

      /*
       * Set and move on...
       */

      if (placemark) request.placemark = placemark;
      return next();

    });

  });

};
