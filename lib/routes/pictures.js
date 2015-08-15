var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/pictures',
    middleware.pictures.findAll,
    function (request, response, next) {
      if (request.pictures) return response.json(request.pictures);
      return next();
    }
  );

  app.post('/pictures',
    middleware.auth.verify,
    middleware.pictures.create,
    function (request, response, next) {
      if (request.picture) return response.json(request.picture);
      return next();
    }
  );

  app.get('/pictures/:id',
    middleware.pictures.findById,
    function (request, response, next) {
      if (request.picture) return response.json(request.picture);
      return next();
    }
  );

  app.put('/pictures/:id',
    middleware.auth.verify,
    middleware.pictures.findById,
    middleware.pictures.verify,
    middleware.pictures.update,
    function (request, response, next) {
      if (request.picture) return response.json(request.picture);
      return next();
    }
  );

  app.delete('/pictures/:id', middleware.auth.verify,
    middleware.auth.verify,
    middleware.pictures.findById,
    middleware.pictures.verify,
    middleware.pictures.delete,
    function (request, response, next) {
      if (request.picture) return response.json(request.picture);
      return next();
    }
  );

}
