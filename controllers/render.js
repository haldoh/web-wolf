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
var uuid = require('node-uuid');

var auth = require('../models/auth');
var voip = require('../models/voip');
var chat = require('../models/chat');

var logger = require('../config/logger');
var config = require('../config/config');

module.exports.home = function (req, res, next) {

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
		user: req.user,
		message: req.flash('login')
	});
};

module.exports.signup = function (req, res, next) {

	return res.render('signup', {
		title: 'Signup',
		user: req.user,
		message: req.flash('signup')
	});
};

module.exports.voipCall = function (req, res, next) {

	// Get a call token from the voip layer
	return voip.callToken(req.user.token, function (err, resp, body) {

		// Error
		if (err) {
			logger.warn('Error while calling VoIP layer: ' + JSON.stringify(err));
			return res.status(500).send(err);
		}
		// Bad response from voip layer
		else if (resp.statusCode < 200 || resp.statusCode > 399) {
			logger.warn('Bad response from VoIP layer: ' + JSON.stringify(resp));
			return res.status(resp.statusCode).send(resp);
		}
		// OK - process data
		else {

			// Parse response body
			var bodyObj;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {

				// Log errors
				logger.warn('Error parsing response body for voip call token - error: ' + e);
				logger.warn('Error parsing response body for voip call token - body: ' + body);
			} finally {

				// Render page
				return res.render('voip-call', {
					title: 'VoIP Call',
					user: req.user,
					token: bodyObj.token
				});
			}
		}
	});
};

module.exports.board = function (req, res, next) {
	return res.render('board', {
		title: 'Board',
		user: req.user
	});
};

module.exports.chat = function (req, res, next) {

	// Generate a random room ID
	var roomId = uuid.v4();
	roomId = roomId.replace(/-/g, '');

	// Redirect to the chat room
	res.redirect('chat/' + roomId);

	// // Request temporary token from chat layer
	// chat.getTempToken(req.user.token, function (err, resp, body) {

	// 	// Error
	// 	if (err) {
	// 		logger.warn('Error while calling chat layer: ' + JSON.stringify(err));
	// 		return res.status(500).send(err);
	// 	}
	// 	// Bad response from chat layer
	// 	else if (resp.statusCode < 200 || resp.statusCode > 399) {
	// 		logger.warn('Bad response from chat layer: ' + JSON.stringify(resp));
	// 		return res.status(resp.statusCode).send(resp);
	// 	}
	// 	// OK - process data
	// 	else {

	// 		// Parse response body
	// 		var bodyObj = {};
	// 		try {
	// 			bodyObj = JSON.parse(body);
	// 		} catch (e) {

	// 			// Log errors
	// 			logger.warn('Error parsing response body for chat temp token - error: ' + e);
	// 			logger.warn('Error parsing response body for chat temp token - body: ' + body);
	// 		} finally {

	// 			// Render page
	// 			return res.render('chat', {
	// 				title: 'Chat',
	// 				user: req.user,
	// 				chatEndpoint: config.chat.endpoint,
	// 				chatToken: bodyObj.token,
	// 				roomId: roomId
	// 			});
	// 		}
	// 	}
	// });
};

module.exports.chatRoom = function (req, res, next) {

	// Get room ID
	var roomId = req.params.roomId;

	// Request temporary token from chat layer
	chat.getTempToken(req.user.token, function (err, resp, body) {

		// Error
		if (err) {
			logger.warn('Error while calling chat layer: ' + JSON.stringify(err));
			return res.status(500).send(err);
		}
		// Bad response from chat layer
		else if (resp.statusCode < 200 || resp.statusCode > 399) {
			logger.warn('Bad response from chat layer: ' + JSON.stringify(resp));
			return res.status(resp.statusCode).send(resp);
		}
		// OK - process data
		else {

			// Parse response body
			var bodyObj = {};
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {

				// Log errors
				logger.warn('Error parsing response body for chat temp token - error: ' + e);
				logger.warn('Error parsing response body for chat temp token - body: ' + body);
			} finally {

				// Render page
				return res.render('chat', {
					title: 'Chat',
					user: req.user,
					chatEndpoint: config.chat.endpoint,
					chatToken: bodyObj.token,
					roomId: roomId
				});
			}
		}
	});
};

// Remote user info test
module.exports.authTest = function (req, res, next) {
	
	return auth.loggedUserData(req.user, function (err, resp, body) {
		logger.debug(JSON.stringify(resp));
		logger.debug(body);
		return res.send(body);
	});
};

// Local user info test
module.exports.localTest = function (req, res, next) {

	logger.debug(req.user);
	return res.send(req.user);
};