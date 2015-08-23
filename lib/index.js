var middleware = require('./middleware');
var env = require('./env');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

/*
 * Create Express instance and
 * export it in the `app` key.
 */

var app = module.exports = express();

/*
 * Set environment using env singleton.
 */

app.set('env', env.name);

/*
 * Parse JSON body in POST requests.
 */

app.use(bodyParser.json({ limit: '50mb' }));

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

/*
 * Build the routes.
 */

require('./routes')(app);

/*
 * Error handling.
 */

app.use(middleware.error);
