var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/events',
    middleware.events.findAll,
    function (request, response, next) {
      if (request.events) return response.json(request.events);
      return next();
    }
  );

  app.post('/events',
    middleware.auth.verify,
    middleware.events.create,
    function (request, response, next) {
      if (request.event) return response.json(request.event);
      return next();
    }
  );

  app.get('/events/:id',
    middleware.events.findById,
    function (request, response, next) {
      if (request.event) return response.json(request.event);
      return next();
    }
  );

  app.put('/events/:id',
    middleware.auth.verify,
    middleware.events.findById,
    middleware.events.verify,
    middleware.events.update,
    function (request, response, next) {
      if (request.event) return response.json(request.event);
      return next();
    }
  );

  app.delete('/events/:id', middleware.auth.verify,
    middleware.auth.verify,
    middleware.events.findById,
    middleware.events.verify,
    middleware.events.delete,
    function (request, response, next) {
      if (request.event) return response.json(request.event);
      return next();
    }
  );

}
