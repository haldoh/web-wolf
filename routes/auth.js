/*
 * Copyright (C) 2016 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the web-wolf project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

var express = require('express');
var router = express.Router();
var passport = require('passport');

var auth = require('../controllers/auth');

router.route('/login')
	// POST - login action
	.post(passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/fail'
	}));

router.route('/facebook')
	// GET - Facebook auth
	.get(auth.facebookAuth);

router.route('/twitter')
	// GET - twitter auth
	.get(auth.twitterAuth);

router.route('/google')
	// GET - Google auth
	.get(auth.googleAuth);

router.route('/session_setup')
	// GET - Session setup callback route
	.get(auth.sessionSetup, auth.loggedRedirect);

router.route('/logout')
	// GET - Logout
	.get(auth.isAuthenticated, auth.logout);

module.exports = router;