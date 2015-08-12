var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/posts',
    middleware.posts.findAll,
    function (request, response, next) {
      if (request.posts) return response.json(request.posts);
      return next();
    }
  );

  app.post('/posts',
    middleware.auth.verify,
    middleware.posts.create,
    function (request, response, next) {
      if (request.post) return response.json(request.post);
      return next();
    }
  );

  app.get('/posts/:id',
    middleware.posts.findById,
    function (request, response, next) {
      if (request.post) return response.json(request.post);
      return next();
    }
  );

  app.put('/posts/:id',
    middleware.auth.verify,
    middleware.posts.findById,
    middleware.posts.verify,
    middleware.posts.update,
    function (request, response, next) {
      if (request.post) return response.json(request.post);
      return next();
    }
  );

  app.delete('/posts/:id', middleware.auth.verify,
    middleware.auth.verify,
    middleware.posts.findById,
    middleware.posts.verify,
    middleware.posts.delete,
    function (request, response, next) {
      if (request.post) return response.json(request.post);
      return next();
    }
  );

  app.post('/posts/:id/threads',
    middleware.auth.verify,
    middleware.posts.findById,
    middleware.threads.create,
    function (request, response, next) {
      if (request.thread) return response.json(request.thread);
      return next();
    }
  );

  app.post('/posts/:id/threads/:thread/messages',
    middleware.auth.verify,
    middleware.posts.findById,
    middleware.threads.findById,
    middleware.messages.create,
    function (request, response, next) {
      if (request.message) return response.json(request.message);
      return next();
    }
  );

}
