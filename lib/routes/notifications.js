var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/notifications',
    middleware.auth.verify,
    middleware.notifications.findAll,
    function (request, response, next) {
      if (request.notifications) return response.json(request.notifications);
      return next();
    }
  );

}
