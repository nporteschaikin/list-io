var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/places',
    middleware.places.find,
    function (request, response, next) {
      if (response.places) {
        return response.json({
          places: response.places
        });
      }
      return next();
    }
  );

};
