module.exports = function (app) {

  require('./auth')(app);
  require('./events')(app);
  require('./pictures')(app);
  require('./placemarks')(app);
  require('./users')(app);

}
