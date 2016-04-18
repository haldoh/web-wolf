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
		}
	},

	// Heroku configuration parameters
	heroku: {
		mode: 'heroku',
		endpoint: endpoint.heroku,
		port: process.env.PORT,
		sessionSecret: process.env.SESSION_SECRET,
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
		}
	}
};

// Return the correct configuration parameters based on environment
module.exports = process.env.NODE_ENV ? config[process.env.NODE_ENV] : config.local;