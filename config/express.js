/*
 * Copyright (C) 2016 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the web-wolf project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

// Requires
var express = require('express');
var session = require('express-session');
var serveStatic = require('serve-static');
var redisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var cors = require('cors');

var logger = require('./logger');
var config = require('./config');

// Express config
module.exports = function () {

	/*
	 * Express configuration
	 */

	// Create app
	var app = express();

	// view engine setup
	app.set('views', './views');
	app.set('view engine', 'jade');
	// jade layouts disabled by default
	app.set('view options', {
		layout: false
	});
	// show pretty html
	app.locals.pretty = true;

	// Parse JSON
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	// Use morgan for request logs
	app.use(morgan(config.morgan, {
		"stream": {
			write: function (message, encoding) {
				logger.info(message);
			}
		}
	}));

	// Passport references
	app.use(session({
		secret: config.sessionSecret,
		resave: false,
		saveUninitialized: true,
		store: new redisStore({
			url: config.redis.uri
		})
	}));
	app.use(passport.initialize());
	app.use(passport.session());


	/*
	 * Routes
	 */

	// Enable cross-domain requests for all routes
	app.use(cors());

	// Static files (CSS, JS, etc...)
	app.use(serveStatic('./public', {
		index: false
	}));

	// Documentation - static
	app.use('/docs', express.static('docs'));
	// Static/generic routes
	app.use('/', require('../routes/static'));

	/*
	 * HTTP server setup
	 */
	var server = require('http').createServer(app);
	server.listen(config.port);
	console.log("Environment: " + config.mode);
	console.log("HTTP server listening on port " + config.port);

	// Return the express app
	return app;
};