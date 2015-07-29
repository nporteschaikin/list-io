var url = require('url');
var request = require('request');

exports.getProfilePictureUrl = function (uid, callback) {
  var u = url.format({
    protocol: 'http',
    host: 'graph.facebook.com',
    pathname: ('v2.4/' + uid + '/picture'),
    query: {
      redirect: false,
      width: 710,
      height: 710
    }
  });
  return request.get({
    uri: u,
    json: true
  }, function (error, response, body) {
    if (error) return callback(error);
    return callback(error, body.data.url);
  });
}
