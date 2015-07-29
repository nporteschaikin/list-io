var env = require('./env');
var middleware = require('./middleware');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

module.exports = (function (app) {

  /*
   * Set environment using env singleton.
   */

  app.set('env', env.name);
  /*
   * Parse JSON body in POST requests.
   */

  app.use(bodyParser.json({ limit: '50mb' }));

  /*
   * Parse URL-encoded forms in POST requests.
   */

  app.use(bodyParser.urlencoded({ extended: true }));

  if (env.isDevelopment) {

    /*
     * Use morgan for request logging.
     * In development, full output.
     */

    app.use(morgan('dev'));

  } else {

    /*
     * Use morgan for request logging.
     * In production, minimal output.
     */

    app.use(morgan('tiny'));

  }

  /*
   * Authenticate.
   */

  app.use(middleware.auth.init);

});
