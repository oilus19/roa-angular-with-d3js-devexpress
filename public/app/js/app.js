'use strict';

var app = angular.module('resultsonair-app', [
	'ngCookies',

	'ui.router',
	'ui.bootstrap',

	'oc.lazyLoad',

	'resultsonair.controllers',
	'resultsonair.directives',
	'resultsonair.factory',
	'resultsonair.services',

	// Added in v1.3
	'FBAngular'
]);

app.run(function($ocLazyLoad, ASSETS)
{
	// Page Loading Overlay
	public_vars.$pageLoadingOverlay = jQuery('.page-loading-overlay');

	$ocLazyLoad.load([
		ASSETS.core.moment,
		ASSETS.forms.daterangepicker,
		ASSETS.tables.export,
	]);

	jQuery(window).load(function()
	{
		public_vars.$pageLoadingOverlay.addClass('loaded');
	})
});