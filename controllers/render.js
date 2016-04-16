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
var logger = require('../config/logger');

module.exports.home = function (req, res, next) {
	logger.debug('User: ' + JSON.stringify(req.user));
	return res.render('index', {
		title: 'Home',
		user: req.user,
		auth: require('../config/config').auth.endpoint,
		endpoint: require('../config/config').endpoint 
	});
};

module.exports.login = function (req, res, next) {
	return res.render('login', {
		title: 'Login',
		user: req.user
	});
};


// Test
module.exports.userTest = function (req, res, next) {
	var options = {
		url: require('../config/config').auth.endpoint + '/users/me',
		headers: {
			cookie: 'connect.sid=' + req.user.connection
		}
	};
	require('request')(options, function (err, resp, body) {
		logger.debug(JSON.stringify(resp));
		logger.debug(body);
		res.send(body);
	});
};