var utils = require('./../utils');

module.exports = function (app) {

  app.get('/geocoder/placemark', function (request, response) {
    return utils.geocoder.reverse(request.query.latitude, request.query.longitude, function (error, placemark) {
      var middleware = require('./../middleware');
      return response.json(placemark);
    });
  });

}
