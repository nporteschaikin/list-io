module.exports = function (app) {

  require('./auth')(app);
  require('./categories')(app);
  require('./geocoder')(app);
  require('./notifications')(app);
  require('./posts')(app);
  require('./users')(app);

}
