var middleware = require('./middleware');
var plugins = require('./plugins');
var mongo = require('./../mongo');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Event = new Schema({

  coordinates: {
    type: [Number],
    index: '2dsphere',
    required: true
  },

  place: {
    name: {
      type: String,
      required: true
    },
    formattedAddress: {
      type: String,
      required: true
    }
  },

  startTime: {
    type: Date,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  text: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }

});

Event.plugin(plugins.tags, {
  sourceAttribute: 'text'
});

Event.plugin(plugins.attachments, {
  photo: {
    required: false
  }
});

module.exports = mongo.model('Event', Event);
