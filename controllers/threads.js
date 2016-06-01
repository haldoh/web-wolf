/*
 * Copyright (C) 2016 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the web-wolf project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

// Requires
var request = require('request');

var config = require('../config/config');

var getOptions = function (req) {
	var opt = {
		headers: {
			'x-wolf-platform': config.board.platform,
			'x-wolf-token': config.board.platform
		}
	};
	return opt;
};

var getAuthOptions = function (req) {
	var opt = {
		headers: {
			'x-wolf-platform': config.board.platform,
			'x-wolf-token': config.board.token,
			'x-wolf-user-token': req.user.token
		}
	};
	return opt;
};

module.exports.list = function (req, res, next) {
	var url = config.board.endpoint + '/board';
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'GET';
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.get = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid;
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'GET';
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.new = function (req, res, next) {
	var url = config.board.endpoint + '/board';
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'POST';
	options.form = req.body;
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.edit = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid;
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'PUT';
	options.form = req.body;
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.delete = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid;
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'DELETE';
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.upvoteThread = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid + '/vote';
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'PUT';
	options.form = {};
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.downvoteThread = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid + '/vote';
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'DELETE';
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.newMessage = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid;
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'POST';
	options.form = req.body;
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.editMessage = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid + '/' + req.params.messageid;
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'PUT';
	options.form = req.body;
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.deleteMessage = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid + '/' + req.params.messageid;
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'DELETE';
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.upvoteMessage = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid + '/' + req.params.messageid + '/vote';
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'PUT';
	options.form = {};
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.downvoteMessage = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid + '/' + req.params.messageid + '/vote';
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'DELETE';
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.newComment = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid + '/' + req.params.messageid;
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'POST';
	options.form = req.body;
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.editComment = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid + '/' + req.params.messageid + '/' + req.params.commentid;
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'PUT';
	options.form = req.body;
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.deleteComment = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid + '/' + req.params.messageid + '/' + req.params.commentid;
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'DELETE';
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.upvoteComment = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid + '/' + req.params.messageid + '/' + req.params.commentid + '/vote';
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'PUT';
	options.form = {};
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};

module.exports.downvoteComment = function (req, res, next) {
	var url = config.board.endpoint + '/board/' + req.params.threadid + '/' + req.params.messageid + '/' + req.params.commentid + '/vote';
	var options = getAuthOptions(req);
	options.url = url;
	options.method = 'DELETE';
	return request(options, function (err, resp, body) {
		if (err)
			return res.status(500).send('Error from board layer: ' + err);
		else {
			var bodyObj = null;
			try {
				bodyObj = JSON.parse(body);
			} catch (e) {
				return res.status(500).send('Error parsing response - not JSON: ' + body);
			}
			return res.status(resp.statusCode).send(bodyObj);
		}
	});
};