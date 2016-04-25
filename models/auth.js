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
var jwt = require('jsonwebtoken');

var config = require('../config/config');
var logger = require('../config/logger');

/*** EXPORTED FUNCTIONS ***/

// Get the user data from the auth layer
module.exports.loggedUserData = function (user, callback) {
	return authCall('/users/me', 'GET', user.token, null, {}, callback);
};

// Auth layer local signin
module.exports.localSignin = function (data, callback) {
	return authCall('/auth/local/signin', 'POST', null, null, data, callback);
};

// Auth layer local signup
module.exports.localSignup = function (data, callback) {
	return authCall('/auth/local/signup', 'POST', null, null, data, callback);
};

// Facebook signin
module.exports.facebookSignin = function (data, callback) {
	return authCall('/auth/facebook/signin', 'POST', null, null, data, callback);
};

// Twitter signin
module.exports.twitterSignin = function (data, callback) {
	return authCall('/auth/twitter/signin', 'POST', null, null, data, callback);
};

// Google signin
module.exports.googleSignin = function (data, callback) {
	return authCall('/auth/google/signin', 'POST', null, null, data, callback);
};

// Verify a user token
module.exports.verifyUserToken = function (token, callback) {

	// Secret
	var secret = config.jwtSecret;

	// Options
	var options = {};

	// Verify token
	jwt.verify(token, secret, options, callback);
};

/*** PRIVATE FUNCTIONS ***/

// Basic template for calls to the auth layer
var authCall = function (path, method, token, cookieJar, data, callback) {

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

	// Add user token if given
	if (token)
		options.headers['x-wolf-user-token'] = token;

	// Call auth layer
	return require('request')(options, callback);
};

// Build parameter for callback and redirect after external login
var buildRefUrl = function (returnUrl) {

	// Base refUrl is the local callback for session setup
	var refUrl = config.endpoint + '/auth/session_setup';

	// Add an URL for redirect if given
	if (returnUrl)
		refUrl += '?refUrl=' + returnUrl;

	// Return full prameter
	return refUrl;
};