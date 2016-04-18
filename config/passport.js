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
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');

var logger = require('./logger');
var config = require('./config');

module.exports = function () {

	/* Serialize user for the session
	 */
	passport.serializeUser(function (usr, done) {
		done(null, usr);
	});

	/* Deserialize user
	 */
	passport.deserializeUser(function (usr, done) {
		done(null, usr);
	});

	/* Local login
	 */
	passport.use('local-login', new LocalStrategy({

			// Define fields used to identify user
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true // Pass back the entire request to the callback
		},
		function (req, email, password, done) {
			var url = config.auth.endpoint + '/auth/login';
			var cookieJar = request.jar();
			var options = {
				url: url,
				method: 'POST',
				followAllRedirects: true,
				jar: cookieJar,
				form: {
					email: email,
					password: password
				}
			};
			request(options, function (err, resp, body) {

				// Login error
				if (err) {
					logger.warn('Error calling auth login: ' + err);
					return done(err);
				}

				// Bad response from auth layer
				else if (resp.statusCode < 200 || resp.statusCode > 399) {
					logger.warn('Bad response from auth layer: ' + JSON.stringify(resp));
					return done(new Error('Bad response from auth layer: ' + JSON.stringify(resp)));
				}

				// Login OK - process user data
				else {

					// Parse response body
					var bodyObj;
					try {
						bodyObj = JSON.parse(body);
					} catch (e) {
						// Log errors and return
						logger.warn('Error parsing login response body - error: ' + e);
						logger.warn('Error parsing login response body - body: ' + body);
						return done(e);
					}

					// Return user data
					return done(null, {
						id: bodyObj._id,
						email: bodyObj.email,
						displayName: bodyObj.displayName,
						facebook: bodyObj.facebook,
						google: bodyObj.google,
						twitter: bodyObj.twitter,
						connection: cookieJar.getCookies(url)[0].value
					});
				}
			});
		}));


	/* Local signup
	 */
	passport.use('local-signup', new LocalStrategy({

			// Define fields used to identify user
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true // Pass back the entire request to the callback
		},
		function (req, email, password, done) {
			// TODO
		}));

	/* Session setup with token
	 */
	passport.use('session-setup', new LocalStrategy({

			passReqToCallback: true // Pass back the entire request to the callback
		},
		function (req, username, password, done) {
			
			// Set up request to auth layer
			var url = require('../config/config').auth.endpoint + '/users/me';
			var cookieJar = request.jar();
			var cookie = request.cookie('connect.sid=' + req.wolfAuthCookie + '; path=/; domain=auth-wolf.herokuapp.com');
			cookieJar.setCookie(cookie, 'https://auth-wolf.herokuapp.com/');
			var options = {
				url: url,
				followAllRedirects: true,
				jar: cookieJar
			};
			request(options, function (err, resp, body) {

				// Error
				if (err) {
					logger.warn('Error calling auth user data: ' + err);
					return done(err);
				}

				// Bad response from auth layer
				else if (resp.statusCode < 200 || resp.statusCode > 399) {
					logger.warn('Bad response from auth layer: ' + JSON.stringify(resp));
					return done(new Error('Bad response from auth layer: ' + JSON.stringify(resp)));
				}

				// OK - process user data
				else {

					// Parse response body
					var bodyObj;
					try {
						bodyObj = JSON.parse(body);
					} catch (e) {
						// Log errors and return
						logger.warn('Error parsing user data response body - error: ' + e);
						logger.warn('Error parsing user data response body - body: ' + body);
						return done(e);
					}

					// Return user data
					return done(null, {
						id: bodyObj._id,
						email: bodyObj.email,
						displayName: bodyObj.displayName,
						facebook: bodyObj.facebook,
						google: bodyObj.google,
						twitter: bodyObj.twitter,
						connection: req.wolfAuthCookie
					});
				}
			});
		}));
};