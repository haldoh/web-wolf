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

// Call the route to receive a voip call token
module.exports.callToken = function (token, callback) {
	return voipCall('/voip/call_token', 'GET', token, null, {}, callback);
};

/*** PRIVATE FUNCTIONS ***/

// Basic template for calls to the voip layer
var voipCall = function (path, method, token, cookieJar, data, callback) {

	// Configure request options
	var options = {
		url: config.voip.endpoint + path,
		method: method,
		followAllRedirects: true,
		headers: {
			'x-wolf-platform': config.voip.platform,
			'x-wolf-token': config.voip.token
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