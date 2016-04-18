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

var auth = require('../models/auth');

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

/* Facebook auth
 */
module.exports.facebookAuth = function (req, res, next) {

	// Get URL to redirect to after signup
	var returnUrl = req.query.hasOwnProperty('refUrl') ? req.query.refUrl : null;

	// Redirect to auth layer
	auth.facebookAuth(returnUrl, res);
};

/* Twitter auth
 */
module.exports.twitterAuth = function (req, res, next) {

	// Get URL to redirect to after signup
	var returnUrl = req.query.hasOwnProperty('refUrl') ? req.query.refUrl : null;

	// Redirect to auth layer
	auth.twitterAuth(returnUrl, res);
};

/* Google auth
 */
module.exports.googleAuth = function (req, res, next) {

	// Get URL to redirect to after signup
	var returnUrl = req.query.hasOwnProperty('refUrl') ? req.query.refUrl : null;

	// Redirect to auth layer
	auth.googleAuth(returnUrl, res);
};

/* Session setup
 */
module.exports.sessionSetup = function (req, res, next) {

	// Try to get ref URL from request
	var refUrl = req.query.hasOwnProperty('refUrl') ? encodeURIComponent(req.query.refUrl) : null;

	// Get token parameter
	req.wolfToken = req.query.hasOwnProperty('token') ? req.query.token : -1;

	// If a ref URL was given, redirect to it, otherwise redirect to home
	req.successRedirect = refUrl ? decodeURIComponent(refUrl) : '/';

	// Trick passport into thinking that we have user and password
	req.body.username = 'user';
	req.body.password = 'pwd';

	// Call passport strategy
	return passport.authenticate('session-setup', {
		failureRedirect: '/fail'
	})(req, res, next);
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