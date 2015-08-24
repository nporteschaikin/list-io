var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/users',
    middleware.users.findAll,
    function (request, response, next) {
      if (request.users) {
        return response.json({
          users: request.users
        });
      }
      return next();
    }
  );

  app.get('/users/:id',
    middleware.users.findById,
    function (request, response, next) {
      if (request.user) {
        return response.json({
          user: request.user
        });
      }
      return next();
    }
  );

  app.put('/users/:id',
    middleware.auth.verify,
    middleware.users.update,
    function (request, response, next) {
      if (request.user) {
        return response.json({
          user: request.user
        });
      }
      return next();
    }
  );

}
