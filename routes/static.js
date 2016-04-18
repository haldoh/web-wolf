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

router.route('/')
	// GET - render home page
	.get(render.home);

router.route('/local_test')
	// GET - render local user info
	.get(render.localTest);

router.route('/auth_test')
	// GET - render remote user info
	.get(render.authTest);

router.route('/login')
	// GET - render login page
	.get(render.login);

module.exports = router;