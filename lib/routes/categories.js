var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/categories',
    middleware.categories.findAll,
    function (request, response, next) {
      if (request.categories) return response.json(request.categories);
      return next();
    }
  );

  app.post('/categories',
    middleware.categories.create,
    function (request, response, next) {
      if (request.category) return response.json(request.category);
      return next();
    }
  );

  app.get('/categories/:id',
    middleware.auth.verify,
    middleware.categories.findById,
    function (request, response, next) {
      if (request.category) return response.json(request.category);
      return next();
    }
  );

  app.delete('/categories/:id',
    middleware.auth.verify,
    middleware.categories.findById,
    middleware.categories.delete,
    function (request, response, next) {
      if (request.category) return response.json(request.category);
      return next();
    }
  );

}
