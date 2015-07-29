var geocoder = require('geocoder');
var _ = require('lodash');

exports.reverse = function (lat, lng, callback) {
  return geocoder.reverseGeocode(lat, lng, function (error, details) {
    var result;
    var components;
    var component;
    if (!details) return callback(error);
    if (!(results = details.results)) return callback(null, {});
    if (!(result = results[0])) return callback(null, {});
    if (!(components = result.address_components)) return callback(null, {});

    var object = {};
    for (var i=0; i<components.length; i++) {
      component = components[i];
      types = component.types;
      if (_.contains(types, 'sublocality')) {
        object.sublocality = component.long_name;
      } else if (_.contains(types, 'neighborhood')) {
        object.neighborhood = component.long_name;
      } else if (_.contains(types, 'country')) {
        object.country = component.long_name;
      } else if (_.contains(types, 'locality')) {
        object.locality = component.long_name;
      } else if (_.contains(types, 'administrative_area_level_3')) {
        object.administrativeAreaLevel3 = component.long_name;
      } else if (_.contains(types, 'administrative_area_level_3')) {
        object.administrativeAreaLevel2 = component.long_name;
      } else if (_.contains(types, 'administrative_area_level_1')) {
        object.administrativeAreaLevel1 = component.long_name;
      }
    }

    return callback(null, object);

  })
}
