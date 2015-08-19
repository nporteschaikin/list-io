var config = require('./../../config');
var mongo = require('./../../mongo');
var uuid = require('uuid');
var AWS = require('aws-sdk');

exports.upload = function (attribute) {
  return function (next) {

    /*
     * Create reference to current context.
     */

    var self = this;

    /*
     * Get photo model.
     */

    var Photo = mongo.model('Photo');

    /*
     * Create reference to specified attribute.
     */

    var value = self[attribute];
    if ('object' == typeof value) {
      return next();
    }

    /*
     * If the attribute isn't a string,
     * move on.
     */

    var image = value.image;
    if ('string' !== typeof value) {
      return next();
    }

    /*
     * Run simple regexp test to see if sttring
     * is base64.  If it's not, move on.
     */

    if (!image.test(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/)) {
      return next();
    }

    /*
     * Otherwise, create a key and upload.
     */

    var key = generateKey();
    return s3.putObject({
      Bucket: config.aws.bucket,
      Key: key,
      Body: new Buffer(image, 'base64'),
      ACL: 'public-read'
    }, function (error, data) {

      /*
       * If there's an error, move on.
       */

      if (error) return next();

      /*
       * Otherwise, create a photo object.
       */

      return Photo.create({url: url(key)}, function (error, photo) {

        /*
         * Set photo to correct attribute
         */

        if (photo) self.set(attribute, photo);
        return next();

      });

    });

  }

}

/*
 * Create S3 instance.
 */

var s3 = new AWS.S3({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey
});

/*
 * Generate a random key.
 */

var generateKey = function (ext) {
  return uuid.v4() + '.jpg';
}

/*
 * Generate a URL with a key.
 */

var url = function (key) {
  return 'http://' + config.aws.bucket + '.s3.amazonaws.com/' + key;
}
