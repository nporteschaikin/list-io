var Post = require('./post');
var mongo = require('./../mongo');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Event = new Schema({

  startTime: {
    type: Date,
    required: true
  },

  endTime: {
    type: Date,
    validate: function (date) {
      if (date) {
        return date > this.startTime;
      }
      return true;
    }
  },

  place: {
    type: String,
    required: true
  }

});

module.exports = Post.discriminator('Event', Event);
