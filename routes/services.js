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

var services = require('../controllers/services');

router.route('/auth')
	// GET - check auth service
	.get(services.auth);

router.route('/board')
	// GET - check board service
	.get(services.board);

router.route('/voip')
	// GET - check voip service
	.get(services.voip);

module.exports = router;