/*
 * Copyright (C) 2016 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the web-wolf project
 */

/*jslint node: true*/
/*jslint nomen: true*/
/*global io,window,document,chatEndpoint,chatToken*/
"use strict";

var socket = io.connect(chatEndpoint);

var id = 

socket.on('connect', function () {

	// Socket connected
	console.log('Socket connected');

	// Immediately emit authentication
	socket.emit('authentication', {token: chatToken});
	
	// After authentication...
	socket.on('authenticated', function () {
		// ... use the socket as usual
		console.log('Socket connection authenticated');


	});

	// Socket authentication error
	socket.on('unauthorized', function(err){
		console.log('Error during socket authentication: ' + err.message); 
	});
});