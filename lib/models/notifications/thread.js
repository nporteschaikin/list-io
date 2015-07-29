var Notification = require('./../notification');
var mongo = require('./../../mongo');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ThreadNotification = new Schema({

  post: {
    type: Schema.ObjectId,
    ref: 'Post',
    required: true
  },

  thread: {
    type: Object,
    required: true
  }

});

module.exports = Notification.discriminator('ThreadNotification', ThreadNotification);
