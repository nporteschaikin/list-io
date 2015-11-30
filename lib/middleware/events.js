var config = require('./../config');
var Models = require('./../models');

/*
 * @function Set event conditions.
 */

exports.buildConditions = function (request, response, next) {
  var params = request.query;

  /*
   * Build query conditions.
   */

  var conditions = request.conditions = {};
  if (params.latitude && params.longitude) {
    conditions.coordinates = {
      $geoWithin: {
        $centerSphere: [ [ parseFloat(params.longitude), parseFloat(params.latitude) ], ( parseFloat(params.radius || config.defaultRadius ) / 3963.2) ]
      }
    }
  }

  /*
   * Handle `after` condition.
   */

  if (params.after) {
    conditions.startTime = {
      $gte: new Date(params.after)
    }
  }

  /*
   * Build sorting conditions.
   */

  var sortConditions = request.sortConditions = {};
  var sortBy = params.sortBy || 'startTime'
  var sortOrder = params.sortOrder || 'asc';
  sortConditions[sortBy] = sortOrder;

  /*
   * Move on.
   */

  return next();

}

/*
 * @function Find all events.
 */

exports.findAll = function (request, response, next) {

  /*
   * Build populate array.
   */

  var populate = [
    'place',
    'user'
  ];

  /*
   * Execute request.
   */

  return Models.Event
    .find(request.conditions)
    .sort(request.sortConditions)
    .populate(populate)
    .exec(function (error, events) {
      if (error) return next(error);
      response.events = events;
      return next();
    });

};

/*
 * @function Find most popular tags by conditions.
 */

exports.findPopularTags = function (request, response, next) {

  /*
   * Build base options.
   */

  var limit = 10;
  var unwind = 'tags';

  /*
   * Build group conditions.
   */

  var groupConditions = {
    _id: '$tags',
    count: {
      $sum: 1
    }
  };

  /*
   * Build sort conditions.
   */

  var sortConditions = {
    count: -1
  };

  /*
   * Get all popular tags
   */

  return Models.Event
    .aggregate()
    .unwind(unwind)
    .match(request.conditions)
    .group(groupConditions)
    .limit(limit)
    .sort(sortConditions)
    .exec(function (error, tags) {
      if (error) return next(error);
      response.tags = tags;
      return next();
    })

}

/*
 * @function Find one event by ID.
 */

exports.findById = function (request, response, next) {

  /*
   * Build populate array.
   */

  var populate = [
    'user'
  ];

  /*
   * Execute request.
   */

  return Models.Event
    .findById(request.params.id)
    .populate(populate)
    .exec(function (error, event) {
      if (error) return next(error);
      response.event = event;
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
    user: request.sessionUser,
    coordinates: [ params.longitude, params.latitude ],
    title: params.title,
    startTime: params.startTime,
    placeName: params.placeName,
    placeAddress: params.placeAddress,
    text: params.text
  }

  /*
   * Build attachments.
   */

  var attachments = {
    photo: params.photo
  }

  /*
   * Create document.
   */

  var event = new Models.Event;
  event.set(attrs);
  event.attach(attachments);

  /*
   * Execute request.
   */

  return event.save(function (error, event) {
    if (error) return next(error);
    response.event = event;
    return next();
  });

}

/*
 * @function Update a event.
 */

exports.update = function (request, response, next) {
  if (!response.event) return next();
  var event = response.event;
  var params = request.body;

  /*
   * Build attributes.
   */

  var attrs = {
    title: params.title,
    startTime: params.startTime,
    placeName: params.placeName,
    placeAddress: params.placeAddress,
    text: params.text
  };

  /*
   * Build coordinate attributes.
   */

  if (params.longitude && params.latitude) {
    attrs.coordinates = [ params.longitude, params.latitude ];
  }

  /*
   * Build attachments.
   */

  var attachments = {
    photo: params.photo
  }

  /*
   * Set attributes, attachments and location.
   */

  event.set(attrs);
  event.attach(attachments);

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
  if (!response.event) return next();
  var event = response.event;

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
  if (!response.event) return next();
  var sessionUser = request.sessionUser;
  var event = response.event;
  var user = event.user;
  if (sessionUser.id != user.id) {
    return response.status(401).end();
  }
  return next();
 }
