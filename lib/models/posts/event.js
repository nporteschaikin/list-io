var Post = require('./../post');
var mongo = require('./../../mongo');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventPost = new Schema({

  startTime: {
    type: Date,
    required: true
  },

  endTime: {
    type: Date,
    required: true
  }

});

module.exports = Post.discriminator('EventPost', EventPost);
