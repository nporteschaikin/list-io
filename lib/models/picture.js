var middleware = require('./middleware');
var mongo = require('./../mongo');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Picture = new Schema({

  coordinates: {
    type: [Number],
    index: '2dsphere',
    required: true
  },

  placemark: {
    type: Schema.ObjectId,
    ref: 'Placemark',
    required: true
  },

  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },

  asset: {
    type: Schema.ObjectId,
    ref: 'Photo',
    required: true
  },

  text: {
    type: String
  },

  tags: [String],

  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }

});

Picture.pre('validate', middleware.photo.set('asset'));
Picture.pre('validate', middleware.placemark.set('placemark', 'coordinates'));

module.exports = mongo.model('Picture', Picture);
