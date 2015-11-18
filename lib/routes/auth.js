var middleware = require('./../middleware');

module.exports = function (app) {

  app.post('/auth',
    middleware.auth.create,
    function (request, response) {
      if (response.user) {
        return response.json({
          user: response.user,
          sessionToken: response.sessionToken
        });
      }
      return response.status(401).end();
    }
  );

  app.delete('/auth',
    middleware.auth.verify,
    middleware.auth.delete,
    function (request, response) {
      return response.status(200).end();
    }
  );

  app.post('/auth/aps',
    middleware.auth.verify,
    middleware.auth.aps,
    function (request, response) {
      return response.status(200).end();
    }
  );

};
