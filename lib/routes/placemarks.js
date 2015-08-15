var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/placemark',
    middleware.placemarks.findOrCreateByCoordinates,
    function (request, response, next) {
      if (request.placemark) return response.json(request.placemark);
      return next();
    }
  );

}
