var config = require('./../config');
var uuid = require('uuid');
var AWS = require('aws-sdk');

/*
 * Upload file to S3.
 */

exports.upload = function (base64, ext, callback) {

  /*
   * Create filename.
   */

  var key = generateKey(ext);

  /*
   * Upload to S3
   */

  return s3.putObject({
    Bucket: config.aws.bucket,
    Key: key,
    Body: new Buffer(base64, 'base64'),
    ACL: 'public-read'
  }, function (error, data) {
    return callback(error, !error ? url(key) : null);
  });

};

/*
 * Create S3 instance.
 */

var s3 = new AWS.S3({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey
});


var generateKey = function (ext) {
  return uuid.v4() + '.' + ext;
}

var url = function (key) {
  return 'http://' + config.aws.bucket + '.s3.amazonaws.com/' + key;
}
