var Notification = require('./../notification');
var mongo = require('./../../mongo');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostNotification = new Schema({

  post: {
    type: Schema.ObjectId,
    ref: 'Post',
    required: true
  }

});

module.exports = Notification.discriminator('PostNotification', PostNotification);
