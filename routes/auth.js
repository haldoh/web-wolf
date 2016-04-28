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
	.post(auth.login, auth.authRedirect);

router.route('/signup')
	// POST - signup action
	.post(auth.signup, auth.authRedirect);

router.route('/logout')
	// GET - Logout
	.get(auth.isAuthenticated, auth.logout);

/* Facebook auth
*/
router.route('/facebook')
// GET - Facebook authentication
	.get(auth.facebookAuth);

router.route('/facebook/callback')
// GET - Facebook authentication callback
	.get(auth.facebookAuthCallback, auth.authRedirect);

/* Google auth
*/
router.route('/google')
// GET - Google authentication
	.get(auth.googleAuth);

router.route('/google/callback')
// GET - Google authentication callback
	.get(auth.googleAuthCallback, auth.authRedirect);

/* Twitter auth
*/
router.route('/twitter')
// GET - Twitter authentication
	.get(auth.twitterAuth);

router.route('/twitter/callback')
// GET - Twitter authentication callback
	.get(auth.twitterAuthCallback, auth.authRedirect);

module.exports = router;