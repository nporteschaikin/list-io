var middleware = require('./middleware');
var mongo = require('./../mongo');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Event = new Schema({

  coordinates: {
    type: [Number],
    index: '2dsphere',
    required: true
  },

  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },

  startTime: {
    type: Date,
    required: true
  },

  endTime: {
    type: Date,
    validate: function (date) {
      if (date) return date > this.startTime;
      return true;
    }
  },

  tags: [String],

  photo: {
    type: Schema.ObjectId,
    ref: 'Photo'
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }

});

Event.pre('save', middleware.photo.set('photo'));
Event.pre('save', middleware.placemark.set('placemark', 'coordinates'));

module.exports = mongo.model('Event', Event);
