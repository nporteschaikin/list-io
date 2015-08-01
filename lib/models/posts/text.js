var Post = require('./../post');
var mongo = require('./../../mongo');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TextPost = new Schema({});

module.exports = Post.discriminator('TextPost', TextPost);
