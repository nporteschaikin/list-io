var middleware = require('./middleware');
var mongo = require('./../mongo');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({

  facebookId: {
    type: String,
    required: true
  },

  displayName: {
    type: String,
    required: true
  },

  profilePhoto: {
    type: Schema.ObjectId,
    ref: 'Photo'
  },

  coverPhoto: {
    type: Schema.ObjectId,
    ref: 'Photo'
  },

  bio: {
    type: String
  }

});

User.pre('validate', middleware.photo.set('profilePhoto'));
User.pre('validate', middleware.photo.set('coverPhoto'));

module.exports = mongo.model('User', User);
