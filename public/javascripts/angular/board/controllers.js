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
	'categories',
	function ($scope, threads, categories) {

		// Categories
		$scope.categories = categories.getCategories();

		// Get threads from service
		$scope.threads = threads.threads;

		// Parse threads data for categories
		categories.parseThreads($scope.threads);

		// check if there are threads to display
		$scope.noThreads = ($scope.threads.length > 0 ? false : true);

		// Hide/show new thread form
		$scope.threadForm = false;
		$scope.showForm = function () {
			$scope.threadForm = true;
		};
		$scope.hideForm = function () {
			$scope.title = '';
			$scope.text = '';
			$scope.category = '';
			$scope.top = 0;
			$scope.threadForm = false;
			$scope.noThreads = (Object.keys($scope.threads).length > 0 ? false : true);
		};

		// Get category thread number
		$scope.getCategoryThreadNumber = function (category) {
			return categories.getThreadNum(category);
		};

		// Filter for categories with no threads
		$scope.filterEmptyCategories = function () {
			return function (category) {
				return categories.getThreadNum(category) !== 0;
			};
		};

		// Check if a category is collapsed
		$scope.collapsedCategory = function (category) {
			return categories.collapsed(category);
		};

		// Collapse a category
		$scope.collapseCategory = function (category) {
			return categories.collapse(category);
		};

		// uncollapse a category
		$scope.uncollapseCategory = function (category) {
			return categories.uncollapse(category);
		};

		// Create a new thread
		$scope.newThread = function () {
			
			// Create only threads with non-empty data
			if ($scope.title === '' || $scope.text === '')
				return;

			// New thread
			threads.newThread({
				title: $scope.title,
				text: $scope.text,
				category: $scope.category,
				top: $scope.top ? $scope.top : false
			}).success(function (data) {

				// Increase category counter
				categories.increaseThreadNum($scope.category);
				// Hide form
				$scope.hideForm();
			});
		};

		// Delete thread
		$scope.deleteThread = function (thread) {
			if (thread.owned && thread.messagesNumber === 0)
				threads.deleteThread(thread)
					.success(function (data) {

						// Decrease category counter
						categories.decreaseThreadNum(thread.category);
						// Hide form
						$scope.hideForm();
					});
		};

		// Upvote thread
		$scope.upvote = function (thread) {
			if (thread.voted !== 1)
				threads.upvoteThread(thread);
		};

		// Downvote thread
		$scope.downvote = function (thread) {
			if (thread.voted !== -1)
				threads.downvoteThread(thread);
		};
	}
]);

// Controller for single thread page
angular.module('board').controller('ThreadCtrl', [
	'$scope',
	'thread',
	function ($scope, thread) {

		// Main thread object
		$scope.thread = thread.thread;

		// Thread edit form
		$scope.threadForm = false;
		$scope.title = thread.thread.title;
		$scope.text = thread.thread.text;
		
		// New comment form
		$scope.comText = {};
		$scope.commentForm = {};

		// Edit message form
		$scope.editMsgText = {};
		$scope.editMessageForm = {};

		// Edit comment form
		$scope.editComText = {};
		$scope.editCommentForm = {};

		// Show edit thread form
		$scope.showThreadForm = function() {
			$scope.threadForm = true;
		};

		// Hide edit thread form
		$scope.hideThreadForm = function() {
			$scope.title = $scope.thread.title;
			$scope.text = $scope.thread.text;
			$scope.threadForm = false;
		};

		// Show comment form
		$scope.showCommentForm = function(message) {
			$scope.commentForm[message._id] = true;
		};

		// Hide comment form
		$scope.hideCommentForm = function(message) {
			$scope.commentForm[message._id] = false;
		};

		// Show edit message form
		$scope.showEditMessageForm = function(message) {
			$scope.editMsgText[message._id] = message.text;
			$scope.editMessageForm[message._id] = true;
		};

		// Hide edit message form
		$scope.hideEditMessageForm = function(message) {
			$scope.editMsgText[message._id] = message.text;
			$scope.editMessageForm[message._id] = false;
		};

		// Show edit comment form
		$scope.showEditCommentForm = function(message, comment) {
			$scope.editComText[message._id + comment._id] = comment.text;
			$scope.editCommentForm[message._id + comment._id] = true;
		};

		// Hide edit comment form
		$scope.hideEditCommentForm = function(message, comment) {
			$scope.editComText[message._id + comment._id] = comment.text;
			$scope.editCommentForm[message._id + comment._id] = false;
		};

		// Edit thread
		$scope.editThread = function() {
			// Edit only threads if non-empty data is given
			if ($scope.title !== '' && $scope.text !== '')
				thread.edit({
					title: $scope.title,
					text: $scope.text
				}).success(function (data) {
					// Reset and hide form when done
					$scope.hideThreadForm();
				});
		};

		// Upvote thread
		$scope.upvote = function () {
			if ($scope.thread.voted !== 1)
				thread.upvote();
		};

		// Downvote thread
		$scope.downvote = function () {
			if ($scope.thread.voted !== -1)
				thread.downvote();
		};

		// Send a new message
		$scope.sendMessage = function () {
			// Send only non-empty messages
			if ($scope.msgText !== '')
				thread.sendMessage({
					text: $scope.msgText
				}).success(function (data) {
					// Reset form when done
					$scope.msgText = '';
				});
		};

		// Edit a message
		$scope.editMessage = function (message) {
			// Edit message only if non-empty data is given
			if ($scope.editMsgText[message._id] !== '')
				thread.editMessage(message, {
					text: $scope.editMsgText[message._id]
				}).success(function (data) {
					// Reset and hide form when done
					$scope.hideEditMessageForm(message);
				});
		};

		// Delete message
		$scope.deleteMessage = function (message) {
			if (message.owned && message.commentsNumber === 0)
				thread.deleteMessage(message);
		};

		// Upvote message
		$scope.upvoteMessage = function (message) {
			if (message.voted !== 1)
				thread.upvoteMessage(message);
		};

		// Downvote message
		$scope.downvoteMessage = function (message) {
			if (message.voted !== -1)
				thread.downvoteMessage(message);
		};

		// Send a new comment
		$scope.sendComment = function (message) {

			// Send only non-empty messages
			if ($scope.comText[message._id] !== '')
				thread.sendComment(message, {
					text: $scope.comText[message._id]
				}).success(function (data) {
					// Reset form
					$scope.comText[message._id] = '';
					// Hide form
					$scope.commentForm[message._id] = false;
				});
		};

		// Edit a comment
		$scope.editComment = function (message, comment) {
			// Edit message only if non-empty data is given
			if ($scope.editComText[message._id + comment._id] !== '')
				thread.editComment(message, comment, {
					text: $scope.editComText[message._id + comment._id]
				}).success(function (data) {
					// Reset and hide form when done
					$scope.hideEditCommentForm(message, comment);
				});
		};

		// Delete comment
		$scope.deleteComment = function (message, comment) {
			if (comment.owned)
				thread.deleteComment(message, comment);
		};

		// Upvote comment
		$scope.upvoteComment = function (messageid, comment) {
			if (comment.voted !== 1)
				thread.upvoteComment(messageid, comment);
		};

		// Downvote comment
		$scope.downvoteComment = function (messageid, comment) {
			if (comment.voted !== -1)
				thread.downvoteComment(messageid, comment);
		};
	}
]);