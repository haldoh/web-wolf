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
var passport = require('passport');

var config = require('../config/config');
var logger = require('../config/logger');

/* Check if user is authenticated
 */
module.exports.isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		return res.status(401).send('Unauthorized');
};

/* Session setup
 */
module.exports.sessionSetup = function (req, res, next) {

	// Try to get ref URL from request
	var refUrl = req.query.hasOwnProperty('refUrl') ? encodeURIComponent(req.query.refUrl) : null;

	// If a ref URL was given, redirect to it, otherwise redirect to home
	req.successRedirect = refUrl ? decodeURIComponent(refUrl) : '/';

	// Get cookie value
	var cookieValue = req.headers && req.headers.cookie ? req.headers.cookie : null;
	cookieValue = cookieValue && 1 in cookieValue.split('=') ? cookieValue.split('=')[1] : null;

	// Store value in request
	req.wolfAuthCookie = cookieValue;

	// Trick passport in thinking that we have user and password
	req.body.username = 'user';
	req.body.password = 'pwd';

	// Call passport strategy
	return passport.authenticate('session-setup', {})(req, res, next);
};

/* Redirection after external auth
 */
module.exports.loggedRedirect = function (req, res, next) {
	// Redirect
	res.redirect(req.successRedirect);
};

/* Logout
 */
module.exports.logout = function (req, res, next) {
	if (req.logout)
		req.logout();
	return res.redirect('/');
};