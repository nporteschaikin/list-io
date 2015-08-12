var mongo = require('./../mongo')
var utils = require('./../utils');
var mongoose = require('mongoose')
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

  profilePictureUrl: {
    type: String
  },

  coverPhotoUrl: {
    type: String
  },

  bio: {
    type: String
  }

});

User.virtual('coverPhoto').set(function (coverPhoto) {
  this.coverPhotoBase64String = coverPhoto;
});

User.virtual('profilePicture').set(function (profilePicture) {
  this.profilePictureBase64String = profilePicture;
});

User.pre('save', function (next) {
  var self = this;
  if (self.coverPhotoBase64String) {
    return utils.s3.upload(self.coverPhotoBase64String, 'jpg', function (error, url) {
      self.set({coverPhotoUrl: url});
      self.coverPhotoBase64String = null;
      return next();
    });
  }
  return next();
});

User.pre('save', function (next) {
  var self = this;
  if (self.profilePictureBase64String) {
    return utils.s3.upload(self.profilePictureBase64String, 'jpg', function (error, url) {
      self.set({profilePictureUrl: url});
      self.profilePictureBase64String = null;
      return next();
    });
  }
  return next();
});


module.exports = mongo.model('User', User);
