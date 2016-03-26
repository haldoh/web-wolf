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
		// Method to retrieve a single thread
		o.getThread = function (id) {
			return $http.get('/threads/' + id).then(function (res) {
				return res.data.thread;
			});
		};
		// Create a new thread
		o.newThread = function (thread) {
			return $http.post('/threads', thread).success(function (data) {
				o.threads[data._id] = data;
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
		// Upvote thread - called from thread page
		o.upvoteThread = function (thread) {
			return $http.put('/threads/' + thread._id + '/vote')
				.success(function (data) {
					thread.upvotes = data.upvotes;
					thread.downvotes = data.downvotes;
					thread.voted = data.voted;
				});
		};
		// Downvote thread - called from thread page
		o.downvoteThread = function (thread) {
			return $http.delete('/threads/' + thread._id + '/vote')
				.success(function (data) {
					thread.upvotes = data.upvotes;
					thread.downvotes = data.downvotes;
					thread.voted = data.voted;
				});
		};
		// Upvote message - called from thread page
		o.upvoteMessage = function (threadid, message) {
			return $http.put('/threads/' + threadid + '/' + message._id + '/vote')
				.success(function (data) {
					message.upvotes = data.upvotes;
					message.downvotes = data.downvotes;
					message.voted = data.voted;
				});
		};
		// Downvote message - called from thread page
		o.downvoteMessage = function (threadid, message) {
			return $http.delete('/threads/' + threadid + '/' + message._id + '/vote')
				.success(function (data) {
					message.upvotes = data.upvotes;
					message.downvotes = data.downvotes;
					message.voted = data.voted;
				});
		};
		// Upvote comment - called from thread page
		o.upvoteComment = function (threadid, messageid, comment) {
			return $http.put('/threads/' + threadid + '/' + messageid + '/' + comment._id + '/vote')
				.success(function (data) {
					comment.upvotes = data.upvotes;
					comment.downvotes = data.downvotes;
					comment.voted = data.voted;
				});
		};
		// Downvote comment - called from thread page
		o.downvoteComment = function (threadid, messageid, comment) {
			return $http.delete('/threads/' + threadid + '/' + messageid + '/' + comment._id + '/vote')
				.success(function (data) {
					comment.upvotes = data.upvotes;
					comment.downvotes = data.downvotes;
					comment.voted = data.voted;
				});
		};
		// Send a new message
		o.sendMessage = function (threadid, message) {
			return $http.post('/threads/' + threadid, message);
		};
		// Send a new comment
		o.sendComment = function (threadid, messageid, comment) {
			return $http.post('/threads/' + threadid + '/' + messageid, comment);
		};
		return o;
	}
]);

// Countries service
angular.module('countries', []).factory('countries', [
	'$http',
	function ($http) {
		var o = {
			countries: []
		};
		// List all countries
		o.getAll = function () {
			return $http.get('/countries').success(function (data) {
				angular.copy(data.countries, o.countries);
			});
		};
	}
]);