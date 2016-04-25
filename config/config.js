/*
 * Copyright (C) 2016 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the web-wolf project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

var endpoint = {
	local: 'http://192.168.0.8:4000',
	heroku: 'https://web-wolf.herokuapp.com'
};

// Configuration object
var config = {

	// Local configuration parameters
	local: {
		mode: 'local',
		endpoint: endpoint.local,
		port: 4000,
		sessionSecret: 'localSessionSecret',
		jwtSecret: 'localJwtSecret',
		morgan: 'REQ :remote-addr - :remote-user  ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time',
		// mongo: {
		// 	uri: 'mongodb://localhost:27017/web'
		// },
		redis: {
			uri: 'redis://127.0.0.1:6379/3'
		},
		auth: {
			endpoint: 'http://localhost:3000',
			platform: 'web-wolf',
			token: 'localhost_web_token'
		},
		googleAuth: {
			clientID: 'process.env.GOOGLE_CLIENT_ID',
			clientSecret: 'process.env.GOOGLE_CLIENT_SECRET',
			callbackURL: '/auth/google/callback'
		},
		facebookAuth: {
			clientID: '1164717263579046',
			clientSecret: 'c42f6d29e918e065f9c5ff8c4f4fd3ae',
			callbackURL: '/auth/facebook/callback/'
		},
		twitterAuth: {
			consumerKey: 'process.env.TWITTER_CONSUMER_KEY',
			consumerSecret: 'process.env.TWITTER_CONSUMER_SECRET',
			callbackURL: '/auth/twitter/callback'
		}
	},

	// Heroku configuration parameters
	heroku: {
		mode: 'heroku',
		endpoint: endpoint.heroku,
		port: process.env.PORT,
		sessionSecret: process.env.SESSION_SECRET,
		jwtSecret: process.env.JWT_SECRET,
		morgan: 'REQ :remote-addr - :remote-user  ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time',
		// mongo: {
		// 	uri: process.env.MONGOLAB_URI
		// },
		redis: {
			uri: process.env.REDIS_URL
		},
		auth: {
			endpoint: 'https://auth-wolf.herokuapp.com',
			platform: process.env.AUTH_PLATFORM,
			token: process.env.AUTH_TOKEN
		},
		googleAuth: {
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: endpoint.heroku + '/auth/google/callback'
		},
		facebookAuth: {
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: endpoint.heroku + '/auth/facebook/callback'
		},
		twitterAuth: {
			consumerKey: process.env.TWITTER_CONSUMER_KEY,
			consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
			callbackURL: endpoint.heroku + '/auth/twitter/callback'
		}
	}
};

// Return the correct configuration parameters based on environment
module.exports = process.env.NODE_ENV ? config[process.env.NODE_ENV] : config.local;