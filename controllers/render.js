/*
 * Copyright (C) 2016 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the web-wolf project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

module.exports.home = function (req, res, next) {
	return res.render('index', {
		title: 'Home',
		user: req.user
	});
}