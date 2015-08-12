var Models = require('./../models');

exports.findAll = function (request, response, next) {
  var params = request.query;

  /*
   * Conditions
   */

  var conditions = {};
  if (params.category) conditions.category = params.category;
  if (params.user) conditions.user = params.user;
  if (params.latitude && params.longitude) {
    conditions.location = {
      $geoWithin: {
        $centerSphere: [ [ params.longitude, params.latitude ], ( params.radius || config.posts.defaultRadius ) / 3963.2 ]
      }
    }
  };

  /*
   * Sorting parameters.
   */

  var sortConditions = {};
  var sortBy = params.sortBy || 'createdAt'
  var sortOrder = params.sortOrder || 'desc';
  sortConditions[sortBy] = sortOrder;

  /*
   * Options if search query included.
   */

  var options = {};
  if (params.search) {
    conditions.$text = {
      $search: params.search
    }
    options.score = {
      $meta: 'textScore'
    };
    sortConditions.score = {
      $meta: 'textScore'
    }
  }

  /*
   * Execute request.
   */

  return Models.Post
    .find(conditions, options)
    .sort(sortConditions)
    .populate(relations(request.sessionUser))
    .exec(function (error, posts) {
      if (error) return next(error);
      request.posts = posts;
      return next();
    });

}

exports.findById = function (request, response, next) {
  return Models.Post
    .findById(request.params.id)
    .populate(relations(request.sessionUser))
    .exec(function (error, post) {
      if (error) return next(error);
      request.post = post;
      return next();
    });
}

exports.create = function (request, response, next) {
  var params = request.body;

  /*
   * Build base attributes.
   */

  var attrs = {
    location: [params.longitude, params.latitude],
    category: params.category,
    user: request.sessionUser,
    title: params.title,
    content: params.content,
    coverPhoto: params.coverPhoto
  }

  /*
   * Create callback for all post types.
   */

  var callback = function (error, post) {
    if (error) return next(error);
    request.post = post;
    return next();
  }

  if (params.event) {

    /*
     * Build event attributes.
     */

     attrs.startTime = params.event.startTime;
     attrs.endTime = params.event.endTime;
     attrs.place = params.event.place;

    /*
     * Create event.
     */

    return Models.Event.create(attrs, callback);

  }

  /*
   * Create post.
   */

  return Models.Post.create(attrs, callback);

}

exports.update = function (request, response, next) {
  if (!request.post) return next();
  var post = request.post;
  var params = request.body;

  /*
   * Build base attributes.
   */

  var attrs = {
    title: params.title,
    content: params.content,
    coverPhoto: params.coverPhoto
  }

  /*
   * Build event attributes.
   */

  if (params.event) {
    attrs.startTime = params.event.startTime;
    attrs.endTime = params.event.endTime;
    attrs.place = params.event.place;
  }

  /*
   * Set attributes.
   */

  post.set(attrs);

  /*
   * Save.
   */

  return post.save(function (error) {
    if (error) return next(error);
    return next();
  });

}

exports.delete = function (request, response, next) {
  if (!request.post) return next();
  var post = request.post;

  return post.remove(function (error, status) {
    if (error) return next(error);
    next();
  });
}

exports.verify = function (request, response, next) {
  if (request.sessionUser.id != request.post.user.id) {
    return response.status(401).end();
  }
  return next();
}

/*
 * Return relations map to include
 * with all posts.
 */

function relations (user) {
  return [
    { path: 'category'},
    { path: 'user' },
    {
      path: 'threads',
      match: {
        isPrivate: false,
        $or: [ user ? { user: user } : {} ]
      }
    },
    { path: 'threads.user' },
    { path: 'threads.messages.user' },
    { path: 'event' }
  ];
}
