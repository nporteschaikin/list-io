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
   * Handle skip condition.
   */

  request.skipCondition = 'undefined' == typeof params.offset ? parseInt(params.offset) : 0;

  /*
   * Handle limit condition.
   */

  request.limitCondition = 'undefined' == typeof params.limit ? parseInt(params.limit) : 20;

  /*
   * Handle `after` condition.
   */

  if (params.after) {
    conditions.startTime = {
      $gte: new Date(params.after)
    }
  }

  /*
   * Handle `before` condition.
   */

  if (params.before) {
    conditions.startTime = {
      $lte: new Date(params.before)
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
    'placemark',
    'user'
  ];

  /*
   * Execute request.
   */

  return Models.Event
    .find(request.conditions)
    .sort(request.sortConditions)
    .skip(request.skipCondition)
    .limit(request.limitCondition)
    .populate(populate)
    .exec(function (error, events) {
      if (error) return next(error);
      response.events = events;
      return next();
    });

};

/*
 * @function Get query count.
 */

exports.setParams = function (request, response, next) {

  /*
   * Get count.
   */

  return Models.Event
    .count(request.conditions, function (error, count) {
      if (error) return next(error);

      /*
       * Create params object
       * and move on.
       */

      var params = response.params = {};
      params.count = count;
      params.limit = request.limitCondition;
      params.offset = request.skipCondition;
      return next();

    });

}


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
    'placemark',
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
    asset: params.asset
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

  var attrs = {};
  if (params.title) attrs.title = params.title;
  if (params.startTime) attrs.startTime = params.startTime;
  if (params.placeName) attrs.placeName = params.placeName;
  if (params.placeAddress) attrs.placeAddress = params.placeAddress;
  if (params.text) attrs.text = params.text;

  /*
   * Build coordinate attributes.
   */

  if (params.longitude && params.latitude) {
    attrs.coordinates = [ params.longitude, params.latitude ];
  }

  /*
   * Build attachments.
   */

  var attachments = {};
  if (params.asset) attachments.asset = params.asset;

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
