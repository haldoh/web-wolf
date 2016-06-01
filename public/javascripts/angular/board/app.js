/*
 * Copyright (C) 2016 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the web-wolf project
 */

/*jslint node: true*/
/*jslint nomen: true*/
/*global angular,window,document*/
"use strict";


// App name and initialization
var mainAppModuleName = 'board';
var app = angular.module(mainAppModuleName, ['ui.router', 'threads', 'thread']);

// Hashbangs
app.config(['$locationProvider', function ($locationProvider) {
	$locationProvider.hashPrefix('!');
}]);

// Fix for Facebook redirect bug (useful?)
if (window.location.has === '#_=_') {
	window.location.hash = '#!';
}

// Manual bootstrapping
angular.element(document).ready(function () {
	angular.bootstrap(document, [mainAppModuleName]);
});

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('board', {
				url: '/board',
				templateUrl: '/board.html',
				controller: 'BoardCtrl',
				resolve: {
					threadsPromise: ['threads', function (threads) {
						return threads.getAll();
					}]
				}
			})
			.state('thread', {
				url: '/threads/{id}',
				templateUrl: '/thread.html',
				controller: 'ThreadCtrl',
				resolve: {
					threadPromise: ['$stateParams', 'thread', function ($stateParams, thread) {
						return thread.get($stateParams.id);
					}]
				}
			});
		$urlRouterProvider.otherwise('board');
	}
]);