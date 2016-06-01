/*
 * Copyright (C) 2016 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the web-wolf project
 */

/*jslint node: true*/
/*jslint nomen: true*/
/*global angular*/
"use strict";

// Threads service
angular.module('threads', []).factory('threads', [
	'$http',
	function ($http) {
		
		var o = {
			threads: {}
		};

		// Method to list all threads
		o.getAll = function () {
			return $http.get('/threads').success(function (data) {
				angular.copy(data.threads, o.threads);
			});
		};
		
		// Create a new thread
		o.newThread = function (thread) {
			return $http.post('/threads', thread).success(function (data) {
				o.threads[data._id] = data;
			});
		};
		
		// Delete a thread
		o.deleteThread = function (threadid) {
			return $http.delete('/threads/' + threadid).success(function (data) {
				delete o.threads[threadid];
			});
		};
		// Upvote thread - called from list page
		o.upvoteThreadId = function (threadid) {
			return $http.put('/threads/' + threadid + '/vote')
				.success(function (data) {
					o.threads[threadid].upvotes = data.upvotes;
					o.threads[threadid].downvotes = data.downvotes;
					o.threads[threadid].voted = data.voted;
				});
		};
		// Downvote thread - called from list page
		o.downvoteThreadId = function (threadid) {
			return $http.delete('/threads/' + threadid + '/vote')
				.success(function (data) {
					o.threads[threadid].upvotes = data.upvotes;
					o.threads[threadid].downvotes = data.downvotes;
					o.threads[threadid].voted = data.voted;
				});
		};
		
		return o;
	}
]);

// Single thread service
angular.module('thread', []).factory('thread', [
	'$http',
	function ($http) {
		var o = {
			thread: {}
		};

		// Get thread
		o.get = function (id) {
			return $http.get('/threads/' + id)
				.success(function (data) {
					angular.copy(data.thread, o.thread);
				});
		};

		// Edit thread
		o.edit = function (threadData) {
			return $http.put('/threads/' + o.thread._id, threadData)
				.success(function (data) {
					o.thread.title = data.title;
					o.thread.text = data.text;
					o.thread.updated = data.updated;
				});
		};

		// Upvote thread
		o.upvote = function () {
			return $http.put('/threads/' + o.thread._id + '/vote')
				.success(function (data) {
					o.thread.upvotes = data.upvotes;
					o.thread.downvotes = data.downvotes;
					o.thread.voted = data.voted;
				});
		};
		// Downvote thread
		o.downvote = function () {
			return $http.delete('/threads/' + o.thread._id + '/vote')
				.success(function (data) {
					o.thread.upvotes = data.upvotes;
					o.thread.downvotes = data.downvotes;
					o.thread.voted = data.voted;
				});
		};

		// Send a new message
		o.sendMessage = function (messageData) {
			return $http.post('/threads/' + o.thread._id, messageData)
				.success(function (data) {
					o.thread.messages.push(data);
					// Increase message counter
					o.thread.messagesNumber += 1;
				});
		};

		// Edit a message
		o.editMessage = function (message, messageData) {
			return $http.put('/threads/' + o.thread._id + '/' + message._id, messageData).success(function (data) {
				message.text = data.text;
				message.updated = data.updated;
				o.thread.updated = data.updated;
			});
		};

		// Delete a message
		o.deleteMessage = function (message) {
			return $http.delete('/threads/' + o.thread._id + '/' + message._id).success(function (data) {
				// Search for message to remove
				var index = -1;
				for (var i = 0; i < o.thread.messages.length; i += 1)
					index = o.thread.messages[i]._id === message._id ? i : index;
				// If found, remove
				if (index >= 0)
					o.thread.messages.splice(index, 1);
				// Decrease message counter
				o.thread.messagesNumber -= 1;
			});
		};

		// Upvote message - called from thread page
		o.upvoteMessage = function (message) {
			return $http.put('/threads/' + o.thread._id + '/' + message._id + '/vote')
				.success(function (data) {
					message.upvotes = data.upvotes;
					message.downvotes = data.downvotes;
					message.voted = data.voted;
				});
		};

		// Downvote message - called from thread page
		o.downvoteMessage = function (message) {
			return $http.delete('/threads/' + o.thread._id + '/' + message._id + '/vote')
				.success(function (data) {
					message.upvotes = data.upvotes;
					message.downvotes = data.downvotes;
					message.voted = data.voted;
				});
		};

		// Send a new comment
		o.sendComment = function (message, commentData) {
			return $http.post('/threads/' + o.thread._id + '/' + message._id, commentData)
				.success(function (data) {
					message.comments.push(data);
					// Increase comment counter
					message.commentsNumber += 1;
					o.thread.commentsNumber += 1;
				});
		};

		// Edit a comment
		o.editComment = function (message, comment, commentData) {
			return $http.put('/threads/' + o.thread._id + '/' + message._id + '/' + comment._id, commentData)
				.success(function (data) {
					comment.text = data.text;
					comment.updated = data.updated;
					message.updated = data.updated;
					o.thread.updated = data.updated;
				});
		};

		// Delete a comment
		o.deleteComment = function (message, comment) {
			return $http.delete('/threads/' + o.thread._id + '/' + message._id + '/' + comment._id).success(function (data) {
				// Search for message to remove
				var index = -1;
				for (var i = 0; i < message.comments.length; i += 1)
					index = message.comments[i]._id === comment._id ? i : index;
				// If found, remove
				if (index >= 0)
					message.comments.splice(index, 1);
				// Decrease comment counter
				message.commentsNumber -= 1;
				o.thread.commentsNumber -= 1;
			});
		};

		// Upvote comment - called from thread page
		o.upvoteComment = function (messageid, comment) {
			return $http.put('/threads/' + o.thread._id + '/' + messageid + '/' + comment._id + '/vote')
				.success(function (data) {
					comment.upvotes = data.upvotes;
					comment.downvotes = data.downvotes;
					comment.voted = data.voted;
				});
		};

		// Downvote comment - called from thread page
		o.downvoteComment = function (messageid, comment) {
			return $http.delete('/threads/' + o.thread._id + '/' + messageid + '/' + comment._id + '/vote')
				.success(function (data) {
					comment.upvotes = data.upvotes;
					comment.downvotes = data.downvotes;
					comment.voted = data.voted;
				});
		};

		return o;
	}
]);