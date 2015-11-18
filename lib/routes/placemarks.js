var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/placemark',
    middleware.placemarks.findOrCreateByCoordinates,
    function (request, response, next) {
      if (response.placemark) {
        return response.json({
          placemark: response.placemark
        });
      }
      return next();
    }
  );

}
