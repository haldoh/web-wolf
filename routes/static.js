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

var render = require('../controllers/render');

/* GET home page. */
router.route('/')
	// GET - render home page
	.get(render.home);

module.exports = router;