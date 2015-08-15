var Models = require('./../models');

/*
 * @function Find all events.
 */

exports.findAll = function (request, response, next) {
  var params = request.query;

  /*
   * Build query conditions.
   */

  var conditions = {};
  if (params.latitude && params.longitude) {
    conditions.coordinates = {
      $geoWithin: {
        $centerSphere: [ [ params.longitude, params.latitude ], ( params.radius || config.defaultRadius ) / 3963.2 ]
      }
    }
  }

  /*
   * Build sorting conditions.
   */

  var sortConditions = {};
  var sortBy = params.sortBy || 'createdAt'
  var sortOrder = params.sortOrder || 'desc';
  sortConditions[sortBy] = sortOrder;

  /*
   * Execute request.
   */

  return Models.Event
    .find(conditions)
    .sort(sortConditions)
    .exec(function (error, events) {
      if (error) return next(error);
      request.events = events;
      return next();
    });

};

/*
 * @function Find one event by ID.
 */

exports.findById = function (request, response, next) {

  /*
   * Execute request.
   */

  return Models.Event
    .findById(request.params.id)
    .exec(function (error, event) {
      if (error) return next(error);
      request.event = event;
      return next();
    });

}

/*
 * @function Create a event.
 */

exports.create = function (request, response, next) {
  var params = request.body;

  /*
   * Build attributes.
   */

  var attrs = {
    coordinates: [params.longitude, params.latitude],
    user: request.sessionUser,
    asset: params.asset,
    description: params.description,
    tags: params.tags
  }

  /*
   * Execute request.
   */

  return Models.Event.create(attrs, function () {
    if (error) return next(error);
    request.event = event;
    return next();
  });

}

/*
 * @function Update a event.
 */

exports.update = function (request, response, next) {
  if (!request.event) return next();
  var event = request.event;
  var params = request.body;

  /*
   * Build attributes.
   */

  var attrs = {
    asset: params.asset,
    description: params.description,
    tags: params.tags
  };

  /*
   * Set attributes.
   */

  event.set(attrs);

  /*
   * Save.
   */

  return event.save(function (error) {
    if (error) return next(error);
    return next();
  });

}

/*
 * @function Delete a event.
 */

exports.delete = function (request, response, next) {
  if (!request.event) return next();
  var event = request.event;

  /*
   * Execute removal.
   */

  return event.remove(function (error, status) {
    if (error) return next(error);
    return next();
  });

}

/*
 * @function Verify session user == event user.
 */

exports.verify = function (request, response, next) {
  if (request.sessionUser.id != request.event.user.id) {
    return response.status(401).end();
  }
  return next();
}
