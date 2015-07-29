var express = require('express');

/*
 * Create Express instance and
 * export it in the `app` key.
 */

var app = module.exports = express();

/*
 * Build the app.
 */

require('./app')(app);

/*
 * Build the routes.
 */

require('./routes')(app);
