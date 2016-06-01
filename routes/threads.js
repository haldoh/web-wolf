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
	// PUT - edit this thread
	.put(auth.isAuthenticated, threads.edit)
	// DELETE - delete this thread
	.delete(auth.isAuthenticated, threads.delete);

router.route('/:threadid/vote')
	// PUT - upvote a thread
	.put(auth.isAuthenticated, threads.upvoteThread)
	// DELETE - downvote a thread
	.delete(auth.isAuthenticated, threads.downvoteThread);

router.route('/:threadid/:messageid')
	// POST - post a comment to a message
	.post(auth.isAuthenticated, threads.newComment)
	// PUT - edit this message
	.put(auth.isAuthenticated, threads.editMessage)
	// DELETE - delete this message
	.delete(auth.isAuthenticated, threads.deleteMessage);

router.route('/:threadid/:messageid/vote')
	// PUT - upvote a thread
	.put(auth.isAuthenticated, threads.upvoteMessage)
	// DELETE - downvote a thread
	.delete(auth.isAuthenticated, threads.downvoteMessage);

router.route('/:threadid/:messageid/:commentid')
	// PUT - edit this comment
	.put(auth.isAuthenticated, threads.editComment)
	// DELETE - delete this comment
	.delete(auth.isAuthenticated, threads.deleteComment);

router.route('/:threadid/:messageid/:commentid/vote')
	// PUT - upvote a thread
	.put(auth.isAuthenticated, threads.upvoteComment)
	// DELETE - downvote a thread
	.delete(auth.isAuthenticated, threads.downvoteComment);

module.exports = router;