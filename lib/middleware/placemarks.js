var Models = require('./../models');

/*
 * @function Run a reverse geocode, returning a plcemark.
 */

exports.findOrCreateByCoordinates = function (request, response, next) {
  var params = request.query;
  var attributes = {coordinates: [params.longitude, params.latitude]};

  /*
   * First, see if a placemark already
   * exists for these coordinates.
   */

  return Models.Placemark.findOne(attributes, function (error, placemark) {

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
     * Otherwise, create document...
     */

    var placemark = new Models.Placemark;
    placemark.set(attributes);

    /*
     * ...and save.
     */

    return placemark.save(function (error, placemark) {

      /*
       * Set and move on...
       */

      if (placemark) request.placemark = placemark;
      return next();

    });

  });

};
