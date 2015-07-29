var utils = require('./../utils');

module.exports = function (app) {

  app.get('/geocoder/placemark', function (request, response) {
    return utils.geocoder.reverse(request.query.latitude, request.query.longitude, function (error, placemark) {
      if (error) return response.status(500).end();
      return response.json(placemark);
    });
  });

}
