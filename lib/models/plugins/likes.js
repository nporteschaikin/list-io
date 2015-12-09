var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function (schema) {

  /*
   * Add reference to likes.
   */

  schema.add({
    likes: [{
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    }]
  });

  /*
   * Add like method.
   */

  schema.methods.like = function (user) {
    this.likes.pull(user);
    return this.likes.push(user);
  }

  /*
   * Add unlike method.
   */

  schema.methods.unlike = function (user) {
    return this.likes.pull(user);
  }

}
