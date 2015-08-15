var middleware = require('./middleware');
var mongo = require('./../mongo');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Placemark = new Schema({

  coordinates: {
    type: [Number],
    index: '2dsphere',
    required: true
  },

  neighborhood: {
    type: String
  },

  locality: {
    type: String
  },

  sublocality: {
    type: String
  },

  administrativeAreaLevel3: {
    type: String
  },

  administrativeAreaLevel2: {
    type: String
  },

  administrativeAreaLevel1: {
    type: String
  },

  country: {
    type: String
  }

});

Placemark.pre('save', middleware.placemark.populate);

module.exports = mongo.model('Placemark', Placemark);
