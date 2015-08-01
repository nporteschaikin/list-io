var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/users',
    middleware.users.findAll,
    function (request, response, next) {
      if (request.users) return response.json(request.users);
      return next();
    }
  );

  app.get('/users/:id',
    middleware.users.findById,
    function (request, response, next) {
      if (request.user) return response.json(request.user);
      return next();
    }
  );

  app.get('/users/:id',
    middleware.auth.verify,
    middleware.users.update,
    function (request, response, next) {
      if (request.user) return response.json(request.user);
      return next();
    }
  );

}
