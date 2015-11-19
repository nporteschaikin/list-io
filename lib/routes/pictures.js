var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/pictures',
    middleware.pictures.buildConditions,
    middleware.pictures.findAll,
    middleware.pictures.findPopularTags,
    middleware.placemarks.findOrCreateByCoordinates,
    function (request, response, next) {
      if (response.pictures) {
        return response.json({
          pictures: response.pictures,
          tags: response.tags,
          placemark: response.placemark
        });
      }
      return next();
    }
  );

  app.post('/pictures',
    middleware.auth.verify,
    middleware.pictures.create,
    function (request, response, next) {
      if (response.picture) {
        return response.json({
          picture: response.picture
        });
      }
      return next();
    }
  );

  app.get('/pictures/:id',
    middleware.pictures.findById,
    function (request, response, next) {
      if (response.picture) {
        return response.json({
          picture: response.picture
        });
      }
      return next();
    }
  );

  app.put('/pictures/:id',
    middleware.auth.verify,
    middleware.pictures.findById,
    middleware.pictures.verify,
    middleware.pictures.update,
    function (request, response, next) {
      if (response.picture) {
        return response.json({
          picture: response.picture
        });
      }
      return next();
    }
  );

  app.delete('/pictures/:id',
    middleware.auth.verify,
    middleware.pictures.findById,
    middleware.pictures.verify,
    middleware.pictures.delete,
    function (request, response, next) {
      if (response.picture) {
        return response.json({
          picture: response.picture
        });
      }
      return next();
    }
  );

}
