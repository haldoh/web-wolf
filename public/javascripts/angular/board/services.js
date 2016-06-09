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

// Categories service
angular.module('categories', []).factory('categories', [
	function () {

		var o = {
			categories: {
				'lifestyle': {
					visible: true,
					collapsed: true,
					threadNum: 0
				},
				'politics': {
					visible: true,
					collapsed: true,
					threadNum: 0
				},
				'proposals': {
					visible: true,
					collapsed: true,
					threadNum: 0
				}
			}
		};

		// Get a list of categories
		o.getCategories = function () {
			return Object.keys(o.categories);
		};

		// Parse threads informtaions for categories
		o.parseThreads = function (threads) {
			for (var i = 0; i < threads.length; i += 1)
				if (o.categories[threads[i].category])
					o.categories[threads[i].category].threadNum += 1;
		};

		// Get number of threads in a category (only after calling parseThreads)
		o.getThreadNum = function (category) {
			if (o.categories[category])
				return o.categories[category].threadNum;
			else
				return 0;
		};

		// Increase threadNum for a given category
		o.increaseThreadNum = function (category) {
			if (o.categories[category]) {
				o.categories[category].threadNum += 1;
				return true;
			} else
				return false;
		};

		// Decrease threadNum for a given category
		o.decreaseThreadNum = function (category) {
			if (o.categories[category]) {
				o.categories[category].threadNum -= 1;
				return true;
			} else
				return false;
		};

		// Check if a given category is visible
		o.visible = function (category) {
			return o.categories[category] && o.categories[category].visible;
		};

		// Make a category visible
		o.show = function (category) {
			if (o.categories[category]) {
				o.categories[category].visible = true;
				return true;
			} else
				return false;
		};

		// Make a category not visible
		o.hide = function (category) {
			if (o.categories[category]) {
				o.categories[category].visible = false;
				return true;
			} else
				return false;
		};

		// Check if a given category is collapsed
		o.collapsed = function (category) {
			return o.categories[category] && o.categories[category].collapsed;
		};

		// Make a category collapsed
		o.collapse = function (category) {
			if (o.categories[category]) {
				o.categories[category].collapsed = true;
				return true;
			} else
				return false;
		};

		// Make a category not collapsed
		o.uncollapse = function (category) {
			if (o.categories[category]) {
				o.categories[category].collapsed = false;
				return true;
			} else
				return false;
		};

		return o;
	}
]);

// Threads service
angular.module('threads', []).factory('threads', [
	'$http',
	function ($http) {
		
		var o = {
			threads: []
		};

		// Method to list all threads
		o.getAll = function () {
			return $http.get('/threads').success(function (data) {
				// angular.copy(data.threads, o.threads);
				o.threads = data.threads;
			});
		};
		
		// Create a new thread
		o.newThread = function (thread) {
			return $http.post('/threads', thread).success(function (data) {
				o.threads.push(data);
			});
		};
		
		// Delete a thread
		o.deleteThread = function (thread) {
			return $http.delete('/threads/' + thread._id).success(function (data) {
				for (var i = 0; i < o.threads.length; i += 1)
					if (o.threads[i]._id === thread._id)
						o.threads.splice(i, 1);
			});
		};
		// Upvote thread - called from list page
		o.upvoteThread = function (thread) {
			return $http.put('/threads/' + thread._id + '/vote')
				.success(function (data) {
					thread.upvotes = data.upvotes;
					thread.downvotes = data.downvotes;
					thread.voted = data.voted;
				});
		};
		// Downvote thread - called from list page
		o.downvoteThread = function (thread) {
			return $http.delete('/threads/' + thread._id + '/vote')
				.success(function (data) {
					thread.upvotes = data.upvotes;
					thread.downvotes = data.downvotes;
					thread.voted = data.voted;
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