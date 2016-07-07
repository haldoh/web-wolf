/*
 * Copyright (C) 2016 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the web-wolf project
 */

/*jslint node: true*/
/*jslint nomen: true*/
/*global $,io,window,document,chatEndpoint,chatToken,roomId*/
"use strict";

// Import socket.io library and connect
var socket = io.connect(chatEndpoint);

// Socket behaviour
socket.on('connect', function () {

	// Socket connected
	console.log('Socket connected: ' + socket.id);

	// Immediately emit authentication
	socket.emit('authentication', {token: chatToken});
	
	// After authentication...
	socket.on('authenticated', function () {
		
		console.log('Socket connection authenticated');

		// Join the room
		socket.emit('joinRoom', roomId);

		// Chat room message
		socket.on('messageRoom', function (senderId, message) {
			console.log('Message from ' + senderId + ': ' + message);
			addMessage(message);
		});

		// Someone joined
		socket.on('joinedRoom', function (newSocketId) {
			console.log('Socket joined room: ' + newSocketId);
		});

		// Someone left
		socket.on('leftRoom', function (newSocketId) {
			console.log('Socket left room: ' + newSocketId);
		});

	});

	// Socket authentication error
	socket.on('unauthorized', function(err){
		console.log('Error during socket authentication: ' + err.message); 
	});
});

// Send message button behaviour
$('#sendMessage').click(function () {
	var msg = $('#msgText').val();
	socket.emit('messageRoom', roomId, socket.id, msg);
});

// Add an element to the list of messages
function addMessage (message) {
	$('ul.message-list').append('<li>' + message + '</li>');
}