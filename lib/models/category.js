var mongo = require('./../mongo')
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var Category = new Schema({

  name: {
    type: String,
    required: true
  }

});

module.exports = mongo.model('Category', Category);