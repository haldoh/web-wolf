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

var render = require('../controllers/render');
var auth = require('../controllers/auth');

router.route('/')
	// GET - render home page
	.get(render.home);

router.route('/test')
	// GET - render home page
	.get(render.userTest);

router.route('/login')
	// GET - render login page
	.get(render.login)
	// POST - login action
	.post(passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/fail'
	}));

router.route('/logout')
	.get(auth.isAuthenticated, auth.logout);

module.exports = router;