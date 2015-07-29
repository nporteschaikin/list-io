var Models = require('./../models');
var config = require('./../config');

var findAll = exports.findAll = function (user, params, callback) {
  var conditions = {};
  if (params.latitude && params.longitude) {
    conditions.location = {
      $geoWithin: {
        $centerSphere: [ [ params.longitude, params.latitude ], ( params.radius || config.posts.defaultRadius ) / 3963.2 ]
      }
    }
  };
  if (params.category) conditions.category = params.category;
  if (params.user) conditions.user = params.user;

  var sortConditions = {};
  var sortBy = params.sortBy || 'createdAt'
  var sortOrder = params.sortOrder || 'desc';
  sortConditions[sortBy] = sortOrder;

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

  var relations = [
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
    { path: 'threads.messages.user' }
  ];

  return Models.Post
    .find(conditions, options)
    .sort(sortConditions)
    .populate(relations)
    .exec(callback);
}

var findById = exports.findById = function (user, id, callback) {

  var relations = [
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
    { path: 'threads.messages.user' }
  ];

  return Models.Post
    .findById(id)
    .populate(relations)
    .exec(callback);

}

var create = exports.create = function (user, params, callback) {
  var attributes = {
    location: [params.longitude, params.latitude],
    category: params.category,
    user: user,
    title: params.title,
    content: params.content,
    coverPhoto: params.coverPhoto
  };

  return Models.Post
    .create(attributes, function (error, post) {
      if (error) return callback(error);
      return callback(null, post);
    });
}

var remove = exports.remove = function (post, callback) {
  return post.remove(callback);
}

var createThread = exports.createThread = function (user, post, params, callback) {
  var attributes = {
    user: user,
    content: params.content,
    isPrivate: !!params.isPrivate
  };

  var thread = post.threads.create(attributes);
  post.threads.push(thread);

  return post.save(function (error) {
    if (error) return callback(error);

    Models.Notifications.Thread.create({
      actor: user,
      post: post,
      thread: thread,
      action: 'create',
      recipients: [ post.user ],
      alert: (user.displayName + ' created a thread in "' + post.title + '"')
    });

    return callback(null, thread);
  });

}

var addMessageToThread = exports.addMessageToThread = function (user, post, thread, params, callback) {
  var attributes = {
    user: user,
    content: params.content
  };
  var message = thread.messages.create(attributes);
  thread.messages.push(message);
  return post.save(function (error) {
    if (error) return callback(error);
    // TODO: add notification
    return callback(null, message);
  });
}
