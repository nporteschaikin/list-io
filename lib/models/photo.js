var middleware = require('./middleware');
var mongo = require('./../mongo');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Photo = new Schema({

  url: {
    type: String,
    required: true
  }

});

module.exports = mongo.model('Photo', Photo);
