var Notification = require('./../notification');
var mongo = require('./../../mongo');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserNotification = new Schema({

  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }

});

module.exports = Notification.discriminator('UserNotification', UserNotification);
