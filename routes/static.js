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

router.route('/board')
	// GET - render board page
	.get(auth.isAuthenticated, render.board);

router.route('/call')
	// GET - render VoIP call page
	.get(auth.isAuthenticated, render.voipCall);

router.route('/chat')
	// GET - render chat page
	.get(auth.isAuthenticated, render.chat);

router.route('/chat/:roomId')
	// GET - render chat room page
	.get(render.chatRoom);

router.route('/local_test')
	// GET - render local user info
	.get(render.localTest);

router.route('/auth_test')
	// GET - render remote user info
	.get(render.authTest);

router.route('/login')
	// GET - render login page
	.get(render.login);

router.route('/signup')
	// GET - render signup page
	.get(render.signup);

module.exports = router;