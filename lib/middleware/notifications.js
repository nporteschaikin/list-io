var Models = require('./../models');

exports.findAll = function (request, response, next) {
  var params = request.params;

  /*
   * Set conditions.
   */

  var conditions = {
    recipients: request.sessionUser
  };

  /*
   * Set sort conditions.
   */

  var sortConditions = {};
  var sortBy = params.sortBy || 'createdAt'
  var sortOrder = params.sortOrder || 'desc';
  sortConditions[sortBy] = sortOrder;

  /*
   * Populate relations.
   */

  var relations = [
    { path: 'actor' },
    { path: 'post' },
    { path: 'user' },
    { path: 'thread' }
  ];

  /*
   * Fetch.
   */

  return Models.Notification
    .find(conditions)
    .sort(sortConditions)
    .populate(relations)
    .exec(function (error, notifications) {
      if (error) return next(error);
      request.notifications = notifications;
      return next();
    });

}
