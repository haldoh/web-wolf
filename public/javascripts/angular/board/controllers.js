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

// Main controller for threads list
angular.module('board').controller('BoardCtrl', [
	'$scope',
	'threads',
	function ($scope, threads) {

		$scope.threads = threads.threads;

		$scope.noThreads = (Object.keys($scope.threads).length > 0 ? false : true);

		// Hide/show new thread form
		$scope.threadForm = false;
		$scope.showForm = function () {
			$scope.threadForm = true;
		};
		$scope.hideForm = function () {
			$scope.title = '';
			$scope.text = '';
			$scope.threadForm = false;
		};

		// Create a new thread
		$scope.newThread = function () {
			// Create only threads with non-empty data
			if ($scope.title === '' || $scope.text === '') {
				return;
			}
			threads.newThread({
				title: $scope.title,
				text: $scope.text,
				country: 'it',
				language: 'en'
			});
			// Reset form
			$scope.title = '';
			$scope.text = '';
			$scope.hideForm();
			$scope.noThreads = false;
		};

		// Upvote thread
		$scope.upvote = function (threadid) {
			if ($scope.threads[threadid].voted !== 1)
				threads.upvoteThreadId(threadid);
		};

		// Downvote thread
		$scope.downvote = function (threadid) {
			if ($scope.threads[threadid].voted !== -1)
				threads.downvoteThreadId(threadid);
		};
	}
]);

// Controller for single thread page
angular.module('board').controller('ThreadCtrl', [
	'$scope',
	'threads',
	'thread',
	function ($scope, threads, thread) {

		$scope.thread = thread;
		$scope.comText = {};
		$scope.commentForm = {};

		// Show comment form
		$scope.showCommentForm = function(messageid) {
			$scope.commentForm[messageid] = true;
		};

		// Hide comment form
		$scope.hideCommentForm = function(messageid) {
			$scope.commentForm[messageid] = false;
		};

		// Send a new message
		$scope.sendMessage = function () {
			// Send only non-empty messages
			if ($scope.msgText === '') {
				return;
			}
			threads.sendMessage(thread._id, {
				text: $scope.msgText
			}).success(function (data) {
				// Update this thread
				$scope.thread.messages.push(data);
			});
			// Reset form
			$scope.msgText = '';
		};

		// Send a new comment
		$scope.sendComment = function (message) {

			// Send only non-empty messages
			if ($scope.comText[message._id] === '') {
				return;
			}
			threads.sendComment(thread._id, message._id, {
				text: $scope.comText[message._id]
			}).success(function (data) {
				// Update this thread
				message.comments.push(data);
			});
			// Reset form
			$scope.comText[message._id] = '';
			// Hide form
			$scope.commentForm[message._id] = false;
		};

		// Upvote thread
		$scope.upvote = function () {
			if ($scope.thread.voted !== 1)
				threads.upvoteThread($scope.thread);
		};

		// Downvote thread
		$scope.downvote = function () {
			if ($scope.thread.voted !== -1)
				threads.downvoteThread($scope.thread);
		};

		// Upvote message
		$scope.upvoteMessage = function (message) {
			if (message.voted !== 1)
				threads.upvoteMessage($scope.thread._id, message);
		};

		// Downvote thread
		$scope.downvoteMessage = function (message) {
			if (message.voted !== -1)
				threads.downvoteMessage($scope.thread._id, message);
		};

		// Upvote comment
		$scope.upvoteComment = function (messageid, comment) {
			if (comment.voted !== 1)
				threads.upvoteComment($scope.thread._id, messageid, comment);
		};

		// Downvote comment
		$scope.downvoteComment = function (messageid, comment) {
			if (comment.voted !== -1)
				threads.downvoteComment($scope.thread._id, messageid, comment);
		};
	}
]);