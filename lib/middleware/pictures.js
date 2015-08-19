var Models = require('./../models');

/*
 * @function Find all pictures.
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

  return Models.Picture
    .find(conditions)
    .sort(sortConditions)
    .exec(function (error, pictures) {
      if (error) return next(error);
      request.pictures = pictures;
      return next();
    });

};

/*
 * @function Find one picture by ID.
 */

exports.findById = function (request, response, next) {

  /*
   * Execute request.
   */

  return Models.Picture
    .findById(request.params.id)
    .exec(function (error, picture) {
      if (error) return next(error);
      request.picture = picture;
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
    asset: params.asset,
    text: params.text,
    tags: params.tags
  }

  /*
   * Execute request.
   */

  return Models.Picture.create(attrs, function () {
    if (error) return next(error);
    request.picture = picture;
    return next();
  });

}

/*
 * @function Update a picture.
 */

exports.update = function (request, response, next) {
  if (!request.picture) return next();
  var picture = request.picture;
  var params = request.body;

  /*
   * Build attributes.
   */

  var attrs = {
    coordinates: [params.longitude, params.latitude],
    asset: params.asset,
    text: params.text,
    tags: params.tags
  };

  /*
   * Set attributes.
   */

  picture.set(attrs);

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
  if (!request.picture) return next();
  var picture = request.picture;

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
