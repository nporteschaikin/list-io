var mongo = require('./../mongo');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Like = new Schema({

  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }

});

module.exports = mongo.model('Like', Like);
