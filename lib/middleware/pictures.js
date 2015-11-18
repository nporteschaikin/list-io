var config = require('./../config');
var Models = require('./../models');

/*
 * @function Set picture conditions.
 */

exports.buildConditions = function (request, response, next) {
  var params = request.query;

  /*
   * Build query conditions.
   */

  var conditions = request.conditions = {};
  console.log('pics', [ params.longitude, params.latitude ]);
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

  var sortConditions = request.sortConditions = {};
  var sortBy = params.sortBy || 'createdAt'
  var sortOrder = params.sortOrder || 'desc';
  sortConditions[sortBy] = sortOrder;

  /*
   * Move on.
   */

  return next();

}

/*
 * @function Find all pictures.
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

  return Models.Picture
    .find(request.conditions)
    .sort(request.sortConditions)
    .populate(populate)
    .exec(function (error, pictures) {
      if (error) return next(error);
      response.pictures = pictures;
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
   * Build aggregate conditions.
   */

  var aggregateConditions = {
    $match: request.conditions
  };

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
   * Build aggregate conditions.
   */

  var sortConditions = {
    count: -1
  };

  /*
   * Get all popular tags
   */

  return Models.Picture
    .aggregate(aggregateConditions)
    .unwind(unwind)
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
 * @function Find one picture by ID.
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

  return Models.Picture
    .findById(request.params.id)
    .populate(populate)
    .exec(function (error, picture) {
      if (error) return next(error);
      response.picture = picture;
      return next();
    });

}

/*
 * @function Create a picture.
 */

exports.create = function (request, response, next) {
  var params = request.body;

  /*
   * Build attributes.
   */

  var attrs = {
    user: request.sessionUser,
    coordinates: [ params.longitude, params.latitude ],
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

  var picture = new Models.Picture;
  picture.set(attrs);
  picture.attach(attachments);

  /*
   * Execute request.
   */

  return picture.save(function (error, picture) {
    if (error) return next(error);
    response.picture = picture;
    return next();
  });

}

/*
 * @function Update a picture.
 */

exports.update = function (request, response, next) {
  if (!response.picture) return next();
  var picture = response.picture;
  var params = request.body;

  /*
   * Build attributes.
   */

  var attrs = {
    coordinates: [params.longitude, params.latitude],
    asset: params.asset,
    text: params.text
  };

  /*
   * Build attachments.
   */

  var attachments = {
    asset: params.asset
  }

  /*
   * Set attributes and attachments.
   */

  picture.set(attrs);
  picture.attach(attachments);

  /*
   * Save.
   */

  return picture.save(function (error) {
    if (error) return next(error);
    return next();
  });

}

/*
 * @function Delete a picture.
 */

exports.delete = function (request, response, next) {
  if (!response.picture) return next();
  var picture = response.picture;

  /*
   * Execute removal.
   */

  return picture.remove(function (error, status) {
    if (error) return next(error);
    return next();
  });

}

/*
 * @function Verify session user == picture user.
 */

exports.verify = function (request, response, next) {
  if (request.sessionUser.id != request.picture.user.id) {
    return response.status(401).end();
  }
  return next();
}
