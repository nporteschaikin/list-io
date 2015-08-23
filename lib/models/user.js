var middleware = require('./middleware');
var plugins = require('./plugins');
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

  bio: {
    type: String
  }

});

User.plugin(plugins.attachments, {
  coverPhoto: {
    required: false,
  },
  profilePhoto: {
    required: false
  }
});

module.exports = mongo.model('User', User);
