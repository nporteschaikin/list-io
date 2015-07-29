var controllers = require('./../controllers');

module.exports = function (app) {

  app.get('/categories', function (request, response) {
    return controllers.category.findAll(request.params, function (error, categories) {
      if (error) return response.error(500).json(error);
      return response.json(categories);
    });
  });

  app.post('/categories', function (request, response) {
    return controllers.category.create(request.body, function (error, category) {
      if (error) return response.error(500).json(error);
      return response.json(category);
    });
  });

  app.get('/categories/:id', function (request, response) {
    return controllers.category.findById(request.params.id, function (error, category) {
      if (error) return response.error(500).json(error);
      return response.json(category);
    });
  });

  app.delete('/categories/:id', function (request, response) {
    return controllers.category.remove(request.params.id, function (error, status) {
      if (error) return response.error(500).json(error);
      return response.json(status);
    });
  });

}
