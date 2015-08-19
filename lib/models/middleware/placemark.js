var mongo = require('./../../mongo');
var geocoder = require('geocoder');
var _ = require('lodash');

exports.set = function (placemarkAttribute, coordinatesAttribute) {
  return function (next) {

    /*
     * Create reference to current context.
     */

    var self = this;

    /*
     * Get placemark model.
     */

    var Placemark = mongo.model('Placemark');

    /*
     * Get coordinates.
     */

    var coordinates = self[coordinatesAttribute];

    /*
     * First, see if a placemark already
     * exists for these coordinates.
     */

    return Placemark.findOne({coordinates: coordinates}, function (error, placemark) {

      /*
       * If we found one, just set it
       * to the contextual object and
       * move on.
       */

      if (placemark) {
        self.set(placemarkAttribute, placemark);
        return next();
      }

      /*
       * Otherwise, create one.
       */

      return Placemark.create({coordinates: coordinates}, function (error, placemark) {

        /*
         * Set and move on...
         */

        if (placemark) self.set(placemarkAttribute, placemark);
        return next();

      });

    });

  }
}

exports.populate = function (next) {

  /*
   * Create reference to current context.
   */

  var self = this;

  /*
   * Get coordinates.  If none are set,
   * move on.
   */

  var coordinates = self.coordinates;
  if (!coordinates) return next();

  /*
   * Reverse geocode. TODO: rewrite this
   * because it is so fucking ugly.
   */

  return geocoder.reverseGeocode(self.coordinates[1], self.coordinates[0], function (error, details) {
    var result;
    var components;
    var component;
    if (!details) return next();
    if (!(results = details.results)) return next();
    if (!(result = results[0])) return next();
    if (!(components = result.address_components)) return next();
    for (var i=0; i<components.length; i++) {
      component = components[i];
      types = component.types;
      if (_.contains(types, 'sublocality')) {
        self.sublocality = component.long_name;
      } else if (_.contains(types, 'neighborhood')) {
        self.neighborhood = component.long_name;
      } else if (_.contains(types, 'country')) {
        self.country = component.long_name;
      } else if (_.contains(types, 'locality')) {
        self.locality = component.long_name;
      } else if (_.contains(types, 'administrative_area_level_3')) {
        self.administrativeAreaLevel3 = component.long_name;
      } else if (_.contains(types, 'administrative_area_level_3')) {
        self.administrativeAreaLevel2 = component.long_name;
      } else if (_.contains(types, 'administrative_area_level_1')) {
        self.administrativeAreaLevel1 = component.long_name;
      }
    }
    return next();
  });

}
