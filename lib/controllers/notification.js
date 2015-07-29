var Models = require('./../models');
var utils = require('./../utils');

var findAll = exports.findAll = function (user, params, callback) {

  /*
   * Set conditions.
   */

  var conditions = {
    recipients: user
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
    .exec(callback);

}
