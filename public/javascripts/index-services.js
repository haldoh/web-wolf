// Check auth service
$.get('/services/auth')
	.done(function () {
		// Hide loading animation
		$('#auth-loading').hide();
		// Show success
		$('#auth-status').addClass('glyphicon glyphicon-ok');
	})
	.fail(function () {
		// Hide loading animation
		$('#auth-loading').hide();
		// Show failure
		$('#auth-status').addClass('glyphicon glyphicon-remove');
	});

// Check board service
$.get('/services/board')
	.done(function () {
		// Hide loading animation
		$('#board-loading').hide();
		// Show success
		$('#board-status').addClass('glyphicon glyphicon-ok');
	})
	.fail(function () {
		// Hide loading animation
		$('#board-loading').hide();
		// Show failure
		$('#board-status').addClass('glyphicon glyphicon-remove');
	});

// Check voip service
$.get('/services/voip')
	.done(function () {
		// Hide loading animation
		$('#voip-loading').hide();
		// Show success
		$('#voip-status').addClass('glyphicon glyphicon-ok');
	})
	.fail(function () {
		// Hide loading animation
		$('#voip-loading').hide();
		// Show failure
		$('#voip-status').addClass('glyphicon glyphicon-remove');
	});

// Check chat service
$.get('/services/chat')
	.done(function () {
		// Hide loading animation
		$('#chat-loading').hide();
		// Show success
		$('#chat-status').addClass('glyphicon glyphicon-ok');
	})
	.fail(function () {
		// Hide loading animation
		$('#chat-loading').hide();
		// Show failure
		$('#chat-status').addClass('glyphicon glyphicon-remove');
	});