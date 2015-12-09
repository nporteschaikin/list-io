var redis = require('./../../redis');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function (schema, model, options) {

  /*
   * Create a prefix for likes in Redis.
   */

  var prefix = 'like:' + model + ':';

  /*
   * Add counter to schema.
   */

  schema.add({
    likesCount: {
      type: Number,
      required: true,
      default: 0
    }
  });

  /*
   * Method for liking an object.
   */

  schema.methods.like = function (user, callback) {
    var self = this;
    return redis.sadd(prefix + self.id, user.id, function (error, success) {
      if (success) {

        /*
         * If there was a change,
         * decrement and save.
         */

        self.likesCount += 1;
        return self.save(callback);

      }

      /*
       * Otherwise, move on.
       */

      return callback(error);

    });
  }

  /*
   * Method for unliking an object.
   */

  schema.methods.unlike = function (user, callback) {
    var self = this;

    /*
     * Remove from Redis.
     */

    return redis.srem(prefix + self.id, user.id, function (error, success) {
      if (success) {

        /*
         * If there was a change,
         * decrement and save.
         */

        self.likesCount -= 1;
        return self.save(callback);

      }

      /*
       * Otherwise, move on.
       */

      return callback(error);

    });

  }

}
