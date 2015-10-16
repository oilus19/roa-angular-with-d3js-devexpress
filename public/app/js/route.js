'use strict';

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider, ASSETS){

    //$locationProvider.html5Mode(true);

    $urlRouterProvider.when('', '/login')
	$urlRouterProvider.otherwise('/404');

	$stateProvider.
		// Main Layout Structure
		state('app', {
			url: '/app',
			templateUrl: appHelper.templatePath('layout/app-body'),
			controller: function($rootScope, $sce){
				$rootScope.isLoginPage        = false;
				$rootScope.isLightLoginPage   = false;
				$rootScope.isLockscreenPage   = false;
				$rootScope.isMainPage         = true;
				$rootScope.layoutOptions.horizontalMenu.isVisible = true;
			}
		}).
		// Dashboards
		state('app.dashboard', {
			url: '/dashboard',
			templateUrl: appHelper.templatePath('pages/dashboard'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
						ASSETS.icons.meteocons,
						ASSETS.maps.vectorMaps,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).
		state('app.account', {
			url: '/account',
			templateUrl: appHelper.templatePath('pages/account'),
			resolve: {
				profile: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.icons.elusive,
					]);
				},
				jQueryValidate: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.jQueryValidate,
					]);
				},
			}
		}).
		state('app.team', {
			url: '/team',
			templateUrl: appHelper.templatePath('pages/team'),
		}).
		state('app.upload', {
			url: '/upload',
			templateUrl: appHelper.templatePath('pages/upload'),
			resolve: {
				dropzone: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.dropzone,
					]);
				},
			}
		}).
		state('app.campaign-settings', {
			url: '/campaign-settings',
			templateUrl: appHelper.templatePath('pages/campaign-settings'),
			resolve: {
			}
		}).
		state('app.tracking-settings', {
			url: '/tracking-settings',
			templateUrl: appHelper.templatePath('pages/tracking-settings')
		}).
		state('app.faq', {
			url: '/faq',
			templateUrl: appHelper.templatePath('pages/faq'),
			resolve: {
			}
		}).
		state('app.404', {
			url: '/404',
			templateUrl: appHelper.templatePath('pages/404'),
			resolve: {
			}
		}).
		state('app.raw-data', {
			url: '/raw-data',
			templateUrl: appHelper.templatePath('pages/raw-data'),
			resolve: {
			}
		}).

		// Performance
		state('app.performance', {
			url: '/performance',
			templateUrl: appHelper.templatePath('pages/performance'),		
			resolve: {
				deps: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.tables.datatables,
						ASSETS.tables.rwd,
						ASSETS.extra.scrollbar
					]);
				},
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).

		// Trends
		state('app.trends', {
			url: '/trends',
			templateUrl: appHelper.templatePath('pages/trends'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
				deps: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.tables.rwd,
					]);
				}
			}
		}).

		// ROI
		state('app.roi', {
			url: '/roi',
			templateUrl: appHelper.templatePath('pages/roi'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).

		// Champaign Planner
		state('app.planner', {
			url: '/planner',
			templateUrl: appHelper.templatePath('pages/planner'),
			resolve: {
				deps: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.tables.rwd,
					]);
				},
			}
		}).

		// Raw Breakdown
		state('app.breakdown', {
			url: '/breakdown',
			templateUrl: appHelper.templatePath('pages/breakdown'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
				deps: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.tables.rwd,
					]);
				},
				multiSelect: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.multiSelect,
					]);
				},
			}
		}).
		// Logins and Lockscreen
		state('login', {
			url: '/login',
			templateUrl: appHelper.templatePath('pages/login'),
			controller: 'LoginCtrl',
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.jQueryValidate,
						ASSETS.extra.toastr,
					]);
				},
			}
		}).
		state('logout', {
			url: '/logout',
			templateUrl: appHelper.templatePath('pages/logout'),
			controller: 'LogoutCtrl',
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.jQueryValidate,
						ASSETS.extra.toastr,
					]);
				},
			}
		});
});