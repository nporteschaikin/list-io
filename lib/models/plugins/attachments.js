var config = require('./../../config');
var AWS = require('aws-sdk');
var _ = require('lodash');
var uuid = require('uuid');
var url = require('url');

module.exports = function (schema, attributes) {
  var attributes = attributes || {};

  /*
   * For each attribute, create a nested document schema.
   */

  var addSchema = {};
  var attribute;
  var docSchema;
  for (var key in attributes) {
    attribute = attributes[key];
    docSchema = {};
    docSchema.url = { type: String, required: attribute.required };
    addSchema[key] = docSchema;
  }
  schema.add(addSchema);

  /*
   * Create method to attach a base64 image.
   */

  schema.methods.attach = function (attributes) {
    var attachments = this.attachments = this.attachments || {};

    /*
     * Merge 'em in.
     */

    _.extend(attachments, attributes);

  }

  /*
   * Add a pre-validation method to upload the images.
   */

  schema.pre('validate', function (next) {
    var self = this;
    var attachments = this.attachments = this.attachments || {};
    var keys = Object.keys(attachments);
    var count = keys.length;

    /*
     * Skip if there are no attachments.
     */

    if (!count) return next();

    /*
     * Create callback for knowing
     * when we're set.
     */

    var complete = 0;
    var callback = function (error) {
      complete++;
      if (complete == count) {
        return next();
      }
    }

    var attachment;
    for (var key in attachments) {
      attachment = attachments[key];
      if (!attachment) {
        callback();
        continue;
      }

      /*
       * Determine extension.
       */

      var matches;
      var match;
      var ext;
      if (matches = /data:([a-zA-Z\/]+);base64/.exec(attachment)) {
        match = matches[1];
        switch (match) {
          case 'image/jpg':
          case 'image/jpeg':
            ext = 'jpg';
            break;
          case 'image/png':
            ext = 'png';
            break;
          default:
            break;
        }
      }

      /*
       * Remove type from string.
       */

      attachment = attachment.replace(/data:([a-zA-Z\/]+);base64/, '');

      /*
       * Create key.
       */

      var awsKey = uuid.v4() + (ext ? ('.' + ext) : '');

      /*
       * Upload!
       */

      s3.putObject({
        Bucket: config.aws.bucket,
        Key: awsKey,
        Body: new Buffer(attachment, 'base64'),
        ACL: 'public-read'
      }, function (error, data) {

        /*
         * If there's an error, move on.
         */

        if (error) return callback(error);

        /*
         * Otherwise, set key.
         */

        self[key] = { url: url.resolve(('http://' + config.aws.bucket + '.s3.amazonaws.com/'), awsKey) };
        return callback();

      });

    }

  });

}

/*
 * Create S3 instance.
 */

var s3 = new AWS.S3({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey
});
