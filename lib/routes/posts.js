var controllers = require('./../controllers');
var middleware = require('./../middleware');

module.exports = function (app) {

  app.get('/posts', function (request, response) {
    return controllers.post.findAll(request.user, request.query, function (error, posts) {
      if (error) return response.status(500).json(error);
      return response.json(posts);
    });
  });

  app.post('/posts', middleware.auth.verify, function (request, response) {
    return controllers.post.create(request.user, request.body, function (error, post) {
      if (error) return response.status(500).json(error);
      return response.json(post);
    });
  });

  app.get('/posts/:id', function (request, response) {
    return controllers.post.findById(request.user, request.params.id, function (error, post) {
      if (error) return response.status(500).json(error);
      return response.json(post);
    });
  });

  app.delete('/posts/:id', function (request, response) {
    return controllers.post.findById(request.user, request.params.id, function (error, post) {
      if (error) return response.status(500).json(error);
      if (post.user != request.user) return response.status(401).end();
      return controllers.post.remove(request.user, post, function (error, status) {
        if (error) return response.status(500).json(error);
        return response.json(status);
      });
    });
  });

  app.post('/posts/:id/threads', function (request, response) {
    return controllers.post.findById(request.user, request.params.id, function (error, post) {
      if (error) return response.status(500).json(error);
      return controllers.post.createThread(request.user, post, request.body, function (error, thread) {
        if (error) return response.status(500).json(error);
        return response.json(thread);
      });
    });
  });

  app.post('/posts/:id/threads/:thread/messages', function (request, response) {
    return controllers.post.findById(request.user, request.params.id, function (error, post) {
      if (error) return response.status(500).json(error);
      var thread = post.threads.id(request.params.thread);
      if (!thread) return response.status(500).end();
      return controllers.post.addMessageToThread(request.user, post, thread, request.body, function (error, message) {
        if (error) return response.status(500).json(error);
        return response.json(message);
      });
    });
  });

}
