/*jslint node: true*/
"use strict";

var express = require('express');
var router = express.Router();

var threads = require('../controllers/threads');
var auth = require('../controllers/auth');

router.route('/')
	// GET - list threads
	.get(auth.isAuthenticated, threads.list)
	// POST - new thread
	.post(auth.isAuthenticated, threads.new);

router.route('/:threadid')
	// GET - get a single thread
	.get(auth.isAuthenticated, threads.get)
	// POST - post a message to this thread
	.post(auth.isAuthenticated, threads.newMessage)
	// PUT - post a message to this thread
	.put(auth.isAuthenticated, threads.edit);

router.route('/:threadid/vote')
	// PUT - upvote a thread
	.put(auth.isAuthenticated, threads.upvoteThread)
	// DELETE - downvote a thread
	.delete(auth.isAuthenticated, threads.downvoteThread);

router.route('/:threadid/:messageid')
	// POST - post a comment to a message
	.post(auth.isAuthenticated, threads.newComment);

router.route('/:threadid/:messageid/vote')
	// PUT - upvote a thread
	.put(auth.isAuthenticated, threads.upvoteMessage)
	// DELETE - downvote a thread
	.delete(auth.isAuthenticated, threads.downvoteMessage);

router.route('/:threadid/:messageid/:commentid/vote')
	// PUT - upvote a thread
	.put(auth.isAuthenticated, threads.upvoteComment)
	// DELETE - downvote a thread
	.delete(auth.isAuthenticated, threads.downvoteComment);

module.exports = router;