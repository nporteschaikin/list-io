var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/events',
    middleware.events.buildConditions,
    middleware.events.findAll,
    middleware.events.setParams,
    middleware.events.findPopularTags,
    middleware.placemarks.findOrCreateByCoordinates,
    function (request, response, next) {
      if (response.events) {
        return response.json({
          events: response.events,
          params: response.params,
          tags: response.tags,
          placemark: response.placemark
        });
      }
      return next();
    }
  );

  app.post('/events',
    middleware.auth.verify,
    middleware.events.create,
    function (request, response, next) {
      if (response.event) {
        return response.json({
          event: response.event
        });
      }
      return next();
    }
  );

  app.get('/events/:id',
    middleware.events.findById,
    function (request, response, next) {
      if (response.event) {
        return response.json({
          event: response.event
        });
      }
      return next();
    }
  );

  app.put('/events/:id',
    middleware.auth.verify,
    middleware.events.findById,
    middleware.events.verify,
    middleware.events.update,
    function (request, response, next) {
      if (response.event) {
        return response.json({
          event: response.event
        });
      }
      return next();
    }
  );

  app.delete('/events/:id',
    middleware.auth.verify,
    middleware.events.findById,
    middleware.events.verify,
    middleware.events.delete,
    function (request, response, next) {
      if (response.event) {
        return response.json({
          event: response.event
        });
      }
      return next();
    }
  );

}
