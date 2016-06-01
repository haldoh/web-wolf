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
var request = require('request');

var config = require('../config/config');

module.exports.auth = function (req, res, next) {
	var url = config.auth.endpoint;
	var options = {};
	options.url = url;
	options.method = 'GET';
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from auth layer: ' + err);
		else
			return res.status(resp.statusCode).send();
	});
};

module.exports.board = function (req, res, next) {
	var url = config.board.endpoint;
	var options = {};
	options.url = url;
	options.method = 'GET';
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from auth layer: ' + err);
		else
			return res.status(resp.statusCode).send();
	});
};

module.exports.voip = function (req, res, next) {
	var url = config.voip.endpoint;
	var options = {};
	options.url = url;
	options.method = 'GET';
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from auth layer: ' + err);
		else
			return res.status(resp.statusCode).send();
	});
};