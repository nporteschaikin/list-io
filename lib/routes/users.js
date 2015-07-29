var controllers = require('./../controllers');
var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/users', function (request, response) {
    return controllers.user.findAll(request.query, function (error, users) {
      if (error) return response.status(500).json(error);
      return response.json(users);
    })
  });

  app.get('/users/:id', function (request, response) {
    return controllers.user.findById(request.params.id, function (error, user) {
      if (error) return response.status(500).json(error);
      return response.json(user);
    });
  });

  app.put('/users/:id', middleware.auth.verify, function (request, response) {
    if (request.user.id != request.params.id) return response.status(401).end();
    return controllers.user.edit(request.user, request.body, function (error, user) {
      if (error) return response.status(500).json(error);
      return response.json(user);
    })
  });

}
