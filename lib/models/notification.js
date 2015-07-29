var mongo = require('./../mongo');
var utils = require('./../utils');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notification = new Schema({

  actor: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },

  action: {
    type: 'String',
    required: true
  },

  recipients: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],

  alert: {
    type: String,
    required: 'true'
  },

  createdAt: {
    type: Date,
    default: function () {
      return Date.now();
    }
  }

});

Notification.post('save', function () {
  return utils.aps.sendAlert(this.recipients, this.alert);
});

module.exports = mongo.model('Notification', Notification);
