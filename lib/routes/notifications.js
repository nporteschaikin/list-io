var controllers = require('./../controllers');
var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/notifications', middleware.auth.verify, function (request, response) {
    return controllers.notification.findAll(request.user, request.params, function (error, notifications) {
      if (error) return response.status(500).json(error);
      return response.json(notifications);
    });
  });

}
