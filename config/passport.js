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
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var request = require('request');

var auth = require('../models/auth');

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
	passport.use('local-signin', new LocalStrategy({

			// Define fields used to identify user
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true // Pass back the entire request to the callback
		},
		function (req, email, password, done) {

			// Login data
			var data = {
				email: email,
				password: password
			};

			// Call auth layer local login
			auth.localSignin(data, function (err, resp, body) {

				// Login error
				if (err) {
					logger.warn('Error calling auth layer for local signin: ' + err);
					return done(err);
				}

				// Bad response from auth layer
				else if (resp.statusCode < 200 || resp.statusCode > 399) {
					logger.warn('Bad response from auth layer for local signin: ' + JSON.stringify(resp));
					return done(new Error('Bad response from auth layer for local signin: ' + JSON.stringify(resp)));
				}

				// Login OK - process user data
				else {

					// Parse response body
					var bodyObj;
					try {
						bodyObj = JSON.parse(body);
					} catch (e) {
						// Log errors and return
						logger.warn('Error parsing response body for local signin - error: ' + e);
						logger.warn('Error parsing response body for local signin - body: ' + body);
						return done(e);
					}

					// Decode received token
					return auth.verifyUserToken(bodyObj.token, function (tokenErr, decoded) {
						if (tokenErr) {
							logger.warn('Error decoding user token for local signin: ' + tokenErr);
							return done(tokenErr);
						} else {

							// Return user data
							return done(null, {
								id: decoded.id,
								displayName: decoded.displayName,
								token: bodyObj.token
							});
						}
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
			
			// Login data
			var data = {
				email: email,
				password: password
			};

			// Call auth layer local login
			auth.localSignup(data, function (err, resp, body) {

				// Login error
				if (err) {
					logger.warn('Error calling auth layer for local signup: ' + err);
					return done(err);
				}

				// Bad response from auth layer
				else if (resp.statusCode < 200 || resp.statusCode > 399) {
					logger.warn('Bad response from auth layer for local signup: ' + JSON.stringify(resp));
					return done(new Error('Bad response from auth layer for local signup: ' + JSON.stringify(resp)));
				}

				// Signup OK - process user data
				else {

					// Parse response body
					var bodyObj;
					try {
						bodyObj = JSON.parse(body);
					} catch (e) {
						// Log errors and return
						logger.warn('Error parsing response body for local signup - error: ' + e);
						logger.warn('Error parsing response body for local signup - body: ' + body);
						return done(e);
					}

					// Decode received token
					return auth.verifyUserToken(bodyObj.token, function (tokenErr, decoded) {
						if (tokenErr) {
							logger.warn('Error decoding user token for local signup: ' + tokenErr);
							return done(tokenErr);
						} else {

							// Return user data
							return done(null, {
								id: decoded.id,
								displayName: decoded.displayName,
								token: bodyObj.token
							});
						}
					});
				}
			});
		}));

	/* Facebook auth
	 */
	passport.use(new FacebookStrategy({

			// Application credentials
			clientID: config.facebookAuth.clientID,
			clientSecret: config.facebookAuth.clientSecret
		},

		// Facebook sends back the token and profile
		function (token, refreshToken, profile, done) {

			// Send Facebook data to auth layer

			// Data
			var data = {
				id: profile.id,
				token: token,
				email: profile.emails && 0 in profile.emails ? profile.emails[0].value : null,
				name: profile.displayName
			};

			// Call auth layer facebook signin
			auth.facebookSignin(data, function (err, resp, body) {

				// Login error
				if (err) {
					logger.warn('Error calling auth facebook signin: ' + err);
					return done(err);
				}

				// Bad response from auth layer
				else if (resp.statusCode < 200 || resp.statusCode > 399) {
					logger.warn('Bad response from auth layer for facebook signin: ' + JSON.stringify(resp));
					return done(new Error('Bad response from auth layer for facebook signin: ' + JSON.stringify(resp)));
				}

				// Login OK - process user data
				else {

					// Parse response body
					var bodyObj;
					try {
						bodyObj = JSON.parse(body);
					} catch (e) {
						// Log errors and return
						logger.warn('Error parsing response body for facebook signin - error: ' + e);
						logger.warn('Error parsing response body for facebook signin - body: ' + body);
						return done(e);
					}

					// Decode received token
					return auth.verifyUserToken(bodyObj.token, function (tokenErr, decoded) {
						if (tokenErr) {
							logger.warn('Error decoding user token for facebook signin: ' + tokenErr);
							return done(tokenErr);
						} else {

							// Return user data
							return done(null, {
								id: decoded.id,
								displayName: decoded.displayName,
								token: bodyObj.token
							});
						}
					});
				}
			});
		}));

	/* Google auth
	 */
	passport.use(new GoogleStrategy({

			// Application credentials
			clientID: config.googleAuth.clientID,
			clientSecret: config.googleAuth.clientSecret
		},

		// Google sends back the token and profile
		function (token, refreshToken, profile, done) {

			// Send Google data to auth layer

			// Data
			var data = {
				id: profile.id,
				token: token,
				email: profile.emails && 0 in profile.emails ? profile.emails[0].value : null,
				name: profile.displayName
			};

			// Call auth layer google signin
			auth.googleSignin(data, function (err, resp, body) {

				// Login error
				if (err) {
					logger.warn('Error calling auth google signin: ' + err);
					return done(err);
				}

				// Bad response from auth layer
				else if (resp.statusCode < 200 || resp.statusCode > 399) {
					logger.warn('Bad response from auth layer for google signin: ' + JSON.stringify(resp));
					return done(new Error('Bad response from auth layer for google signin: ' + JSON.stringify(resp)));
				}

				// Login OK - process user data
				else {

					// Parse response body
					var bodyObj;
					try {
						bodyObj = JSON.parse(body);
					} catch (e) {
						// Log errors and return
						logger.warn('Error parsing response body for google signin - error: ' + e);
						logger.warn('Error parsing response body for google signin - body: ' + body);
						return done(e);
					}

					// Decode received token
					return auth.verifyUserToken(bodyObj.token, function (tokenErr, decoded) {
						if (tokenErr) {
							logger.warn('Error decoding user token for google signin: ' + tokenErr);
							return done(tokenErr);
						} else {

							// Return user data
							return done(null, {
								id: decoded.id,
								displayName: decoded.displayName,
								token: bodyObj.token
							});
						}
					});
				}
			});
		}));


	/* Twitter auth
	 */
	passport.use(new TwitterStrategy({

			// Application credentials
			consumerKey: config.twitterAuth.consumerKey,
			consumerSecret: config.twitterAuth.consumerSecret
		},

		// Twitter sends back the token and profile
		function (token, tokenSecret, profile, done) {

			// Send Twitter data to auth layer

			// Data
			var data = {
				id: profile.id,
				token: token,
				username: profile.username,
				displayName: profile.displayName
			};

			// Call auth layer twitter signin
			auth.twitterSignin(data, function (err, resp, body) {

				// Login error
				if (err) {
					logger.warn('Error calling auth twitter signin: ' + err);
					return done(err);
				}

				// Bad response from auth layer
				else if (resp.statusCode < 200 || resp.statusCode > 399) {
					logger.warn('Bad response from auth layer for twitter signin: ' + JSON.stringify(resp));
					return done(new Error('Bad response from auth layer for twitter signin: ' + JSON.stringify(resp)));
				}

				// Login OK - process user data
				else {

					// Parse response body
					var bodyObj;
					try {
						bodyObj = JSON.parse(body);
					} catch (e) {
						// Log errors and return
						logger.warn('Error parsing response body for twitter signin - error: ' + e);
						logger.warn('Error parsing response body for twitter signin - body: ' + body);
						return done(e);
					}

					// Decode received token
					return auth.verifyUserToken(bodyObj.token, function (tokenErr, decoded) {
						if (tokenErr) {
							logger.warn('Error decoding user token for twitter signin: ' + tokenErr);
							return done(tokenErr);
						} else {

							// Return user data
							return done(null, {
								id: decoded.id,
								displayName: decoded.displayName,
								token: bodyObj.token
							});
						}
					});
				}
			});
		}));
};