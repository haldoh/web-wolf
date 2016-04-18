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
var config = require('../config/config');
var logger = require('../config/logger');

/*** EXPORTED FUNCTIONS ***/

// Get the user data from the auth layer
module.exports.loggedUserData = function (user, callback) {
	return authCall('/users/me', 'GET', user.connection, null, {}, callback);
};

// Auth layer local login
module.exports.localLogin = function (data, cookieJar, callback) {
	return authCall('/auth/login', 'POST', null, cookieJar, data, callback);
};

// Auth layer session setup for external auth
module.exports.sessionSetup = function (data, cookieJar, callback) {
	return authCall('/auth/session_setup', 'POST', null, cookieJar, data, callback);
};

// Facebook auth
module.exports.facebookAuth = function (returnUrl, res) {

	// Build refUrl parameter for oAuth login
	var refUrl = refUrl(returnUrl);

	// Redirect to auth layer
	return res.redirect('/auth/facebook?refUrl=' + refUrl);
};

// Twitter auth
module.exports.twitterAuth = function (returnUrl, res) {

	// Build refUrl parameter for oAuth login
	var refUrl = refUrl(returnUrl);

	// Redirect to auth layer
	return res.redirect('/auth/twitter?refUrl=' + refUrl);
};

// Google auth
module.exports.googleAuth = function (returnUrl, res) {

	// Build refUrl parameter for oAuth login
	var refUrl = refUrl(returnUrl);

	// Redirect to auth layer
	res.redirect('/auth/google?refUrl=' + refUrl);
};

/*** PRIVATE FUNCTIONS ***/

// Basic template for calls to the auth layer
var authCall = function (path, method, cookie, cookieJar, data, callback) {

	// Configure request options
	var options = {
		url: config.auth.endpoint + path,
		method: method,
		followAllRedirects: true,
		headers: {
			'x-wolf-auth-platform': config.auth.platform,
			'x-wolf-auth-token': config.auth.token
		}
	};

	// Add form data if needed
	if (method === 'POST' || method === 'PUT')
		options.form = data;

	// Add cookie jar if needed
	if (cookieJar)
		options.jar = cookieJar;

	// Add cookie if given
	if (cookie)
		options.headers.cookie = 'connect.sid=' + cookie;

	// Call auth layer
	return require('request')(options, callback);
};

// Build parameter for callback and redirect after external login
var refUrl = function (returnUrl) {

	// Base refUrl is the local callback for session setup
	var refUrl = config.endpoint + '/session_setup';

	// Add an URL for redirect if given
	if (returnUrl)
		refUrl += '?refUrl=' + returnUrl;

	// Return full prameter
	return refUrl;
};