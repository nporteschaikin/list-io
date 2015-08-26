var config = require('./../../config');
var redis = require('./../../redis');
var apn = require('apn');
var path = require('path');

var connection = new apn.Connection({
  cert: path.resolve(__dirname, './cert.pem'),
  key: path.resolve(__dirname, './key.pem'),
  passphrase: config.aps.passphrase,
  production: false // TODO: fix this.
});

exports.addToken = function (user, token, callback) {
  return redis.sadd(('aps:' + user.id), token, callback);
};

exports.sendAlert = function (uids, alert) {
  var note = new apn.Notification();
  note.alert = alert;
  return sendNotification(uids, note);
}

var sendNotification = function (uids, note) {
  note.expiry = Math.floor(Date.now() / 1000) + 3600;
  for (var x=0; x<uids.length; x++) {
    uid = uids[x];
    redis.smembers(('aps:' + uid), function (error, tokens) {
      for (var y=0; y<tokens.length; y++) {
        device = new apn.Device(tokens[y]);
        connection.pushNotification(note, device);
      }
    });
  }
}
