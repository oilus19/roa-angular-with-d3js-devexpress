'use strict';

angular.module('resultsonair.controllers', []).
	controller('LoginCtrl', function($scope, $rootScope)
	{
		$rootScope.isLoginPage        = true;
		$rootScope.isLightLoginPage   = false;
		$rootScope.isLockscreenPage   = false;
		$rootScope.isMainPage         = false;
		$rootScope.layoutOptions.horizontalMenu.isVisible = false;
		$rootScope.page_title		  = "Login";
	}).
	controller('LoginLightCtrl', function($scope, $rootScope)
	{
		$rootScope.isLoginPage        = true;
		$rootScope.isLightLoginPage   = true;
		$rootScope.isLockscreenPage   = false;
		$rootScope.isMainPage         = false;
	}).
	controller('LockscreenCtrl', function($scope, $rootScope)
	{
		$rootScope.isLoginPage        = false;
		$rootScope.isLightLoginPage   = false;
		$rootScope.isLockscreenPage   = true;
		$rootScope.isMainPage         = false;

		$rootScope.layoutOptions.horizontalMenu.isVisible = false;
	}).
	controller('LogoutCtrl', function($scope, $rootScope)
	{
		$rootScope.isLoginPage        = false;
		$rootScope.isLightLoginPage   = false;
		$rootScope.isLockscreenPage   = true;
		$rootScope.isMainPage         = false;

		$rootScope.layoutOptions.horizontalMenu.isVisible = false;
		$rootScope.page_title		  = "Logout";
	}).
	controller('MainCtrl', function($scope, $rootScope, $location, $layout, $sce, $layoutToggles, $pageLoadingBar, Fullscreen)
	{		
		$rootScope.page_title		  = "Highest returns on TV advertising";
		$rootScope.exportTableSelector = '';
		$rootScope.isLoginPage        = false;
		$rootScope.isLightLoginPage   = false;
		$rootScope.isLockscreenPage   = false;
		$rootScope.isMainPage         = true;

		$rootScope.layoutOptions = {
			horizontalMenu: {
				isVisible		: true,
				isFixed			: true,
				minimal			: false,
				clickToExpand	: false,

				isMenuOpenMobile: false
			},
			sidebar: {
				isVisible		: true,
				isCollapsed		: true,
				toggleOthers	: true,
				isFixed			: true,
				isRight			: true,

				isMenuOpenMobile: false,

				// Added in v1.3
				userProfile		: true
			},
			chat: {
				isOpen			: false,
			},
			settingsPane: {
				isOpen			: false,
				useAnimation	: true
			},
			container: {
				isBoxed			: false
			},
			skins: {
				sidebarMenu		: '',
				horizontalMenu	: '',
				userInfoNavbar	: ''
			},
			pageTitles: true,
			userInfoNavVisible	: false
		};

		$layout.loadOptionsFromCookies(); // remove this line if you don't want to support cookies that remember layout changes


		$rootScope.currentUser = {
			username: 	'Kristel Tuul',
			email: 		'kristel@resultsonair.com',
			password: 	'kristel ',
			photo: 		'assets/images/kristel_tuul.png',
			title: 		$sce.trustAsHtml('CMO at <strong>Resultsonair</strong>'), 
			client: 	'ResultsOnAir' 
		};


		$scope.updatePsScrollbars = function()
		{
			var $scrollbars = jQuery(".ps-scrollbar:visible");

			$scrollbars.each(function(i, el)
			{
				if(typeof jQuery(el).data('perfectScrollbar') == 'undefined')
				{
					jQuery(el).perfectScrollbar();
				}
				else
				{
					jQuery(el).perfectScrollbar('update');
				}
			})
		};


		// Define Public Vars
		public_vars.$body = jQuery("body");


		// Init Layout Toggles
		$layoutToggles.initToggles();


		// Other methods
		$scope.setFocusOnSearchField = function()
		{
			public_vars.$body.find('.search-form input[name="s"]').focus();

			setTimeout(function(){ public_vars.$body.find('.search-form input[name="s"]').focus() }, 100 );
		};

		// Watch changes to replace checkboxes
		$scope.$watch(function()
		{
			cbr_replace();
		});

		// Watch sidebar status to remove the psScrollbar
		$rootScope.$watch('layoutOptions.sidebar.isCollapsed', function(newValue, oldValue)
		{
			if(newValue != oldValue)
			{
				if(newValue == true)
				{
					public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar('destroy')
				}
				else
				{
					public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar({wheelPropagation: public_vars.wheelPropagation});
				}
			}
		});


		// Page Loading Progress (remove/comment this line to disable it)
		$pageLoadingBar.init();

		$scope.showLoadingBar = showLoadingBar;
		$scope.hideLoadingBar = hideLoadingBar;


		// Set Scroll to 0 When page is changed
		$rootScope.$on('$stateChangeStart', function()
		{
			var obj = {pos: jQuery(window).scrollTop()};

			TweenLite.to(obj, .25, {pos: 0, ease:Power4.easeOut, onUpdate: function()
			{
				$(window).scrollTop(obj.pos);
			}});
		});


		// Full screen feature added in v1.3
		$scope.isFullscreenSupported = Fullscreen.isSupported();
		$scope.isFullscreen = Fullscreen.isEnabled() ? true : false;

		$scope.goFullscreen = function()
		{
			if (Fullscreen.isEnabled())
				Fullscreen.cancel();
			else
				Fullscreen.all();

			$scope.isFullscreen = Fullscreen.isEnabled() ? true : false;
		}
	}).
	controller('SidebarMenuCtrl', function($scope, $rootScope, $menuItems, $timeout, $location, $state, $layout)
	{

		// Menu Items
		var $sidebarMenuItems = $menuItems.instantiate();

		$scope.menuItems = $sidebarMenuItems.prepareSidebarMenu().getAll();

		// Set Active Menu Item
		$sidebarMenuItems.setActive( $location.path() );

		$rootScope.$on('$stateChangeSuccess', function()
		{
			$sidebarMenuItems.setActive($state.current.name);
		});

		// Trigger menu setup
		public_vars.$sidebarMenu = public_vars.$body.find('.sidebar-menu');
		$timeout(setup_sidebar_menu, 1);

		ps_init(); // perfect scrollbar for sidebar

		$scope.exportCSV = function() {
			if($($rootScope.exportTableSelector).length>0)
				$($rootScope.exportTableSelector).tableExport({type:'csv', escape:'false'});
		}
		$scope.exportPNG = function() {
			$.ajax({
				type: 'POST',
				data: {link: window.location.href},
			    url: 'export_png',	
			    success: function(res) {
			    	console.log(res.link);
			    	if(res.link!=''){
			    		window.open(res.link, '_blank');
			    	}
			    }
			});
		}
	}).
	controller('HorizontalMenuCtrl', function($scope, $rootScope, $menuItems, $timeout, $location, $state)
	{
		var $horizontalMenuItems = $menuItems.instantiate();

		$scope.menuItems = $horizontalMenuItems.prepareHorizontalMenu().getAll();

		// Set Active Menu Item
		$horizontalMenuItems.setActive( $location.path() );

		$rootScope.$on('$stateChangeSuccess', function()
		{
			$horizontalMenuItems.setActive($state.current.name);

			$(".navbar.horizontal-menu .navbar-nav .hover").removeClass('hover'); // Close Submenus when item is selected
		});

		// Trigger menu setup
		$timeout(setup_horizontal_menu, 1);
	}).
	controller('SettingsPaneCtrl', function($rootScope)
	{
		// Define Settings Pane Public Variable
		public_vars.$settingsPane = public_vars.$body.find('.settings-pane');
		public_vars.$settingsPaneIn = public_vars.$settingsPane.find('.settings-pane-inner');
	}).
	controller('ChatCtrl', function($scope, $element)
	{
		var $chat = jQuery($element),
			$chat_conv = $chat.find('.chat-conversation');

		$chat.find('.chat-inner').perfectScrollbar(); // perfect scrollbar for chat container


		// Chat Conversation Window (sample)
		$chat.on('click', '.chat-group a', function(ev)
		{
			ev.preventDefault();

			$chat_conv.toggleClass('is-open');

			if($chat_conv.is(':visible'))
			{
				$chat.find('.chat-inner').perfectScrollbar('update');
				$chat_conv.find('textarea').autosize();
			}
		});

		$chat_conv.on('click', '.conversation-close', function(ev)
		{
			ev.preventDefault();

			$chat_conv.removeClass('is-open');
		});
	}).
	controller('UIModalsCtrl', function($scope, $rootScope, $modal, $sce)
	{
		// Open Simple Modal
		$scope.openModal = function(modal_id, modal_size, modal_backdrop)
		{
			$rootScope.currentModal = $modal.open({
				templateUrl: modal_id,
				size: modal_size,
				backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop
			});
		};

		// Loading AJAX Content
		$scope.openAjaxModal = function(modal_id, url_location)
		{
			$rootScope.currentModal = $modal.open({
				templateUrl: modal_id,
				resolve: {
					ajaxContent: function($http)
					{
						return $http.get(url_location).then(function(response){
							$rootScope.modalContent = $sce.trustAsHtml(response.data);
						}, function(response){
							$rootScope.modalContent = $sce.trustAsHtml('<div class="label label-danger">Cannot load ajax content! Please check the given url.</div>');
						});
					}
				}
			});

			$rootScope.modalContent = $sce.trustAsHtml('Modal content is loading...');
		}
	}).
	controller('PaginationDemoCtrl', function($scope)
	{
		$scope.totalItems = 64;
		$scope.currentPage = 4;

		$scope.setPage = function (pageNo)
		{
			$scope.currentPage = pageNo;
		};

		$scope.pageChanged = function()
		{
			console.log('Page changed to: ' + $scope.currentPage);
		};

		$scope.maxSize = 5;
		$scope.bigTotalItems = 175;
		$scope.bigCurrentPage = 1;
	}).
	controller('LayoutVariantsCtrl', function($scope, $layout, $cookies)
	{
		$scope.opts = {
			sidebarType: null,
			fixedSidebar: null,
			sidebarToggleOthers: null,
			sidebarVisible: null,
			sidebarPosition: null,

			horizontalVisible: null,
			fixedHorizontalMenu: null,
			horizontalOpenOnClick: null,
			minimalHorizontalMenu: null,

			sidebarProfile: null
		};

		$scope.sidebarTypes = [
			{value: ['sidebar.isCollapsed', false], text: 'Expanded', selected: $layout.is('sidebar.isCollapsed', false)},
			{value: ['sidebar.isCollapsed', true], text: 'Collapsed', selected: $layout.is('sidebar.isCollapsed', true)},
		];

		$scope.fixedSidebar = [
			{value: ['sidebar.isFixed', true], text: 'Fixed', selected: $layout.is('sidebar.isFixed', true)},
			{value: ['sidebar.isFixed', false], text: 'Static', selected: $layout.is('sidebar.isFixed', false)},
		];

		$scope.sidebarToggleOthers = [
			{value: ['sidebar.toggleOthers', true], text: 'Yes', selected: $layout.is('sidebar.toggleOthers', true)},
			{value: ['sidebar.toggleOthers', false], text: 'No', selected: $layout.is('sidebar.toggleOthers', false)},
		];

		$scope.sidebarVisible = [
			{value: ['sidebar.isVisible', true], text: 'Visible', selected: $layout.is('sidebar.isVisible', true)},
			{value: ['sidebar.isVisible', false], text: 'Hidden', selected: $layout.is('sidebar.isVisible', false)},
		];

		$scope.sidebarPosition = [
			{value: ['sidebar.isRight', false], text: 'Left', selected: $layout.is('sidebar.isRight', false)},
			{value: ['sidebar.isRight', true], text: 'Right', selected: $layout.is('sidebar.isRight', true)},
		];

		$scope.horizontalVisible = [
			{value: ['horizontalMenu.isVisible', true], text: 'Visible', selected: $layout.is('horizontalMenu.isVisible', true)},
			{value: ['horizontalMenu.isVisible', false], text: 'Hidden', selected: $layout.is('horizontalMenu.isVisible', false)},
		];

		$scope.fixedHorizontalMenu = [
			{value: ['horizontalMenu.isFixed', true], text: 'Fixed', selected: $layout.is('horizontalMenu.isFixed', true)},
			{value: ['horizontalMenu.isFixed', false], text: 'Static', selected: $layout.is('horizontalMenu.isFixed', false)},
		];

		$scope.horizontalOpenOnClick = [
			{value: ['horizontalMenu.clickToExpand', false], text: 'No', selected: $layout.is('horizontalMenu.clickToExpand', false)},
			{value: ['horizontalMenu.clickToExpand', true], text: 'Yes', selected: $layout.is('horizontalMenu.clickToExpand', true)},
		];

		$scope.minimalHorizontalMenu = [
			{value: ['horizontalMenu.minimal', false], text: 'No', selected: $layout.is('horizontalMenu.minimal', false)},
			{value: ['horizontalMenu.minimal', true], text: 'Yes', selected: $layout.is('horizontalMenu.minimal', true)},
		];

		$scope.chatVisibility = [
			{value: ['chat.isOpen', false], text: 'No', selected: $layout.is('chat.isOpen', false)},
			{value: ['chat.isOpen', true], text: 'Yes', selected: $layout.is('chat.isOpen', true)},
		];

		$scope.boxedContainer = [
			{value: ['container.isBoxed', false], text: 'No', selected: $layout.is('container.isBoxed', false)},
			{value: ['container.isBoxed', true], text: 'Yes', selected: $layout.is('container.isBoxed', true)},
		];

		$scope.sidebarProfile = [
			{value: ['sidebar.userProfile', false], text: 'No', selected: $layout.is('sidebar.userProfile', false)},
			{value: ['sidebar.userProfile', true], text: 'Yes', selected: $layout.is('sidebar.userProfile', true)},
		];

		$scope.resetOptions = function()
		{
			$layout.resetCookies();
			window.location.reload();
		};

		var setValue = function(val)
		{
			if(val != null)
			{
				val = eval(val);
				$layout.setOptions(val[0], val[1]);
			}
		};

		$scope.$watch('opts.sidebarType', setValue);
		$scope.$watch('opts.fixedSidebar', setValue);
		$scope.$watch('opts.sidebarToggleOthers', setValue);
		$scope.$watch('opts.sidebarVisible', setValue);
		$scope.$watch('opts.sidebarPosition', setValue);

		$scope.$watch('opts.horizontalVisible', setValue);
		$scope.$watch('opts.fixedHorizontalMenu', setValue);
		$scope.$watch('opts.horizontalOpenOnClick', setValue);
		$scope.$watch('opts.minimalHorizontalMenu', setValue);

		$scope.$watch('opts.chatVisibility', setValue);

		$scope.$watch('opts.boxedContainer', setValue);

		$scope.$watch('opts.sidebarProfile', setValue);
	}).
	controller('ThemeSkinsCtrl', function($scope, $layout)
	{
		var $body = jQuery("body");

		$scope.opts = {
			sidebarSkin: $layout.get('skins.sidebarMenu'),
			horizontalMenuSkin: $layout.get('skins.horizontalMenu'),
			userInfoNavbarSkin: $layout.get('skins.userInfoNavbar')
		};

		$scope.skins = [
			{value: '', 			name: 'Default'			,	palette: ['#2c2e2f','#EEEEEE','#FFFFFF','#68b828','#27292a','#323435']},
			{value: 'aero', 		name: 'Aero'			,	palette: ['#558C89','#ECECEA','#FFFFFF','#5F9A97','#558C89','#255E5b']},
			{value: 'navy', 		name: 'Navy'			,	palette: ['#2c3e50','#a7bfd6','#FFFFFF','#34495e','#2c3e50','#ff4e50']},
			{value: 'facebook', 	name: 'Facebook'		,	palette: ['#3b5998','#8b9dc3','#FFFFFF','#4160a0','#3b5998','#8b9dc3']},
			{value: 'turquoise', 	name: 'Truquoise'		,	palette: ['#16a085','#96ead9','#FFFFFF','#1daf92','#16a085','#0f7e68']},
			{value: 'lime', 		name: 'Lime'			,	palette: ['#8cc657','#ffffff','#FFFFFF','#95cd62','#8cc657','#70a93c']},
			{value: 'green', 		name: 'Green'			,	palette: ['#27ae60','#a2f9c7','#FFFFFF','#2fbd6b','#27ae60','#1c954f']},
			{value: 'purple', 		name: 'Purple'			,	palette: ['#795b95','#c2afd4','#FFFFFF','#795b95','#27ae60','#5f3d7e']},
			{value: 'white', 		name: 'White'			,	palette: ['#FFFFFF','#666666','#95cd62','#EEEEEE','#95cd62','#555555']},
			{value: 'concrete', 	name: 'Concrete'		,	palette: ['#a8aba2','#666666','#a40f37','#b8bbb3','#a40f37','#323232']},
			{value: 'watermelon', 	name: 'Watermelon'		,	palette: ['#b63131','#f7b2b2','#FFFFFF','#c03737','#b63131','#32932e']},
			{value: 'lemonade', 	name: 'Lemonade'		,	palette: ['#f5c150','#ffeec9','#FFFFFF','#ffcf67','#f5c150','#d9a940']},
		];

		$scope.$watch('opts.sidebarSkin', function(val)
		{
			if(val != null)
			{
				$layout.setOptions('skins.sidebarMenu', val);

				$body.attr('class', $body.attr('class').replace(/\sskin-[a-z]+/)).addClass('skin-' + val);
			}
		});

		$scope.$watch('opts.horizontalMenuSkin', function(val)
		{
			if(val != null)
			{
				$layout.setOptions('skins.horizontalMenu', val);

				$body.attr('class', $body.attr('class').replace(/\shorizontal-menu-skin-[a-z]+/)).addClass('horizontal-menu-skin-' + val);
			}
		});

		$scope.$watch('opts.userInfoNavbarSkin', function(val)
		{
			if(val != null)
			{
				$layout.setOptions('skins.userInfoNavbar', val);

				$body.attr('class', $body.attr('class').replace(/\suser-info-navbar-skin-[a-z]+/)).addClass('user-info-navbar-skin-' + val);
			}
		});
	}).
	// Added in v1.3
	controller('FooterChatCtrl', function($scope, $element)
	{
		$scope.isConversationVisible = false;

		$scope.toggleChatConversation = function()
		{
			$scope.isConversationVisible = ! $scope.isConversationVisible;

			if($scope.isConversationVisible)
			{
				setTimeout(function()
				{
					var $el = $element.find('.ps-scrollbar');

					if($el.hasClass('ps-scroll-down'))
					{
						$el.scrollTop($el.prop('scrollHeight'));
					}

					$el.perfectScrollbar({
						wheelPropagation: false
					});

					$element.find('.form-control').focus();

				}, 300);
			}
		}
	}).
	controller('DashboardPageCtrl', function($scope, $rootScope, $sce, $compile, $element){
		$rootScope.page_title = "Dashboard";

		$.ajax({
			type: 'POST',
			data: {},
		    url: 'dashboard_dataset',	
		    success: function(res) {
		    	$scope.dataset = res.data;
		    	$scope.revenueFromTV = res.revenue;
		    	$scope.returnOnInvestment = Math.floor(res.avg_roi*100)/100;
		    	$scope.costPerConversion = Math.floor(res.avg_cpc*100)/100;
		    	$scope.daily_revenue_list = res.daily_revenue_list;
		    	$scope.accumulated_revenue_list = res.accumulated_revenue_list;
		    	$scope.max_revenue = res.max_revenue;
		    	$scope.initCounters();
		    	$scope.initBarChart();
		    	$scope.initRoiGraph();
		    }
		});
		$scope.initRoiGraph = function(){
			var gauge = $element.find('#gauge-1').dxCircularGauge({
				scale: {
					startValue: 0,
					endValue: 100,
					majorTick: {
						tickInterval: 10
					}
				},
				rangeContainer: {
					palette: 'pastel',            
					width: 15,
					ranges: [
						{ startValue: 0, endValue: 30, color: '#cc3f44' },
						{ startValue: 30, endValue: 70, color: '#ffba00' },
						{ startValue: 70, endValue: 100, color: '#8dc63f' },
					]
				},
				value: 86
			}).dxCircularGauge('instance');
		}
		$scope.initBarChart = function (){
			var i = 0,
				data_source = [];

			for(i=0; i<29; i++)
			{
				data_source.push({day: i, revenue: Number($scope.daily_revenue_list[i])||0});
			}

			$element.find("#pageviews-visitors-chart").dxChart({
				dataSource: data_source,
				legend: {
					position: 'inside',
					paddingLeftRight: 5,
					paddingTop: 15
				},		 
				series: {
					argumentField: "day",
					valueField: "revenue",
					name: "Daily Revenue",
					type: "bar",
					color: '#68b828'
				},
				valueAxis: {
					label: {
						customizeText: function () {
							return Number(this.value/1000) + 'K';
						}
					},
					title: ''
				},
				argumentAxis: {
					label: {
						customizeText: function () {
							return this.value+1;
						}
					}
				},
				tooltip: {
			        enabled: true,
			        location: "edge",
			        customizeTooltip: function (arg) {
			        	var date = new Date(2015,4,arg.argument+1);
			            return {
			                text: moment(date).format("dddd, MMMM D, YYYY") + "<br/>Revenue: $" + arg.valueText + "<br/>Avg CpC: $25"
			            };
			        }
			    }
			});
		}
		$scope.initCounters = function(){
			var revenueFromTVCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+"4050300"+'" data-prefix="$" data-duration="1.5">$0</label>');
			$element.find('.revenue-from-tv-counter').html($compile(revenueFromTVCounterHtml)($scope));
			var returnOnInvestmentCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+"8.1"+'" data-suffix="x" data-duration="1.5">0k</label>');
			$element.find('.return-on-investment-counter').html($compile(returnOnInvestmentCounterHtml)($scope));
			var costPerConversionCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+"37.0"+'" data-prefix="$" data-duration="1.5">$0</label>');
			$element.find('.cost-per-conversion-counter').html($compile(costPerConversionCounterHtml)($scope));
			var budgetROIHtml = $('<div class="h1 text-secondary text-bold" xe-counter data-count="this" data-from="0" data-to="'+86+'" data-suffix="%" data-duration="1">0</div>');
			$element.find('.budget-roi').html($compile(budgetROIHtml)($scope));
		};
		$scope.initMap = function(){
			var map = $element.find("#sample-map-widget");
				
			var gdpData = { "AF": 16.63, "AL": 11.58, "DZ": 158.97, "AO": 85.81, "AG": 1.1, "AR": 351.02, "AM": 8.83, "AU": 1219.72, "AT": 366.26, "AZ": 52.17, "BS": 7.54, "BH": 21.73, "BD": 105.4, "BB": 3.96, "BY": 52.89, "BE": 461.33, "BZ": 1.43, "BJ": 6.49, "BT": 1.4, "BO": 19.18, "BA": 16.2, "BW": 12.5, "BR": 2023.53, "BN": 11.96, "BG": 44.84, "BF": 8.67, "BI": 1.47, "KH": 11.36, "CM": 21.88, "CA": 1563.66, "CV": 1.57, "CF": 2.11, "TD": 7.59, "CL": 199.18, "CN": 5745.13, "CO": 283.11, "KM": 0.56, "CD": 12.6, "CG": 11.88, "CR": 35.02, "CI": 22.38, "HR": 59.92, "CY": 22.75, "CZ": 195.23, "DK": 304.56, "DJ": 1.14, "DM": 0.38, "DO": 50.87, "EC": 61.49, "EG": 216.83, "SV": 21.8, "GQ": 14.55, "ER": 2.25, "EE": 19.22, "ET": 30.94, "FJ": 3.15, "FI": 231.98, "FR": 2555.44, "GA": 12.56, "GM": 1.04, "GE": 11.23, "DE": 3305.9, "GH": 18.06, "GR": 305.01, "GD": 0.65, "GT": 40.77, "GN": 4.34, "GW": 0.83, "GY": 2.2, "HT": 6.5, "HN": 15.34, "HK": 226.49, "HU": 132.28, "IS": 12.77, "IN": 1430.02, "ID": 695.06, "IR": 337.9, "IQ": 84.14, "IE": 204.14, "IL": 201.25, "IT": 2036.69, "JM": 13.74, "JP": 5390.9, "JO": 27.13, "KZ": 129.76, "KE": 32.42, "KI": 0.15, "KR": 986.26, "UNDEFINED": 5.73, "KW": 117.32, "KG": 4.44, "LA": 6.34, "LV": 23.39, "LB": 39.15, "LS": 1.8, "LR": 0.98, "LY": 77.91, "LT": 35.73, "LU": 52.43, "MK": 9.58, "MG": 8.33, "MW": 5.04, "MY": 218.95, "MV": 1.43, "ML": 9.08, "MT": 7.8, "MR": 3.49, "MU": 9.43, "MX": 1004.04, "MD": 5.36, "MN": 5.81, "ME": 3.88, "MA": 91.7, "MZ": 10.21, "MM": 35.65, "NA": 11.45, "NP": 15.11, "NL": 770.31, "NZ": 138, "NI": 6.38, "NE": 5.6, "NG": 206.66, "NO": 413.51, "OM": 53.78, "PK": 174.79, "PA": 27.2, "PG": 8.81, "PY": 17.17, "PE": 153.55, "PH": 189.06, "PL": 438.88, "PT": 223.7, "QA": 126.52, "RO": 158.39, "RU": 1476.91, "RW": 5.69, "WS": 0.55, "ST": 0.19, "SA": 434.44, "SN": 12.66, "RS": 38.92, "SC": 0.92, "SL": 1.9, "SG": 217.38, "SK": 86.26, "SI": 46.44, "SB": 0.67, "ZA": 354.41, "ES": 1374.78, "LK": 48.24, "KN": 0.56, "LC": 1, "VC": 0.58, "SD": 65.93, "SR": 3.3, "SZ": 3.17, "SE": 444.59, "CH": 522.44, "SY": 59.63, "TW": 426.98, "TJ": 5.58, "TZ": 22.43, "TH": 312.61, "TL": 0.62, "TG": 3.07, "TO": 0.3, "TT": 21.2, "TN": 43.86, "TR": 729.05, "TM": 0, "UG": 17.12, "UA": 136.56, "AE": 239.65, "GB": 2258.57, "US": 14624.18, "UY": 40.71, "UZ": 37.72, "VU": 0.72, "VE": 285.21, "VN": 101.99, "YE": 30.02, "ZM": 15.69, "ZW": 5.57 };
			
			var vmap = map.vectorMap({
				map: 'us_aea',
				backgroundColor: '',
				regionStyle: {
				  initial: {
					"fill": '#fff',
					"fill-opacity": 0.2,
					"stroke": '',
					"stroke-width": .7,
					"stroke-opacity": .5
				  },
				  hover: {
					"fill-opacity": 1,
					"fill": "#ddd"
				  }
				},						
				markerStyle: {
					initial: {
						fill: '#fff',
						"stroke": "#fff",
						"stroke-width": 0,
						r: 2.5
					},
					selected: {
						fill: '#7c38bc',
						"stroke-width": 0
					}
				},
				series: {
			        markers: [{
				          attribute: 'r',
				          scale: [7, 15],
				          values: [11342,7601,5567,4987],
				          min: 4987,
				          max: 11342
				    }]
			    },
				markers: [
					{latLng: [40.71, -74.00], name: 'New York'},
					{latLng: [34.05, -118.25], name: 'Los Angeles'},
					{latLng: [41.84, -87.68], name: 'Chicago'},
					{latLng: [42.36, -71.06], name: 'Boston'},
				]
			});
		}
		jQuery(document).ready(function(){
			$scope.initMap();
		});
	}).
	controller('PerformancePageCtrl', function($scope, $rootScope, $element){
		$rootScope.page_title = "Performance";
		$rootScope.exportTableSelector = '.performance-table';

		$scope.performanceChart = {};
		$scope.filter1 = 'networks';
		$scope.filterv = true;
		$scope.sampleData = [];
		$scope.records = [];
		$scope.total = {};


		$scope.ads = 0;
		$scope.palette = [];
		$scope.data = [];
		//$scope.user_type_array=["Returning Visitor"];
		$scope.filter3 = "users"
		$scope.series = [];

		$scope.LoadData = function()
		{
			var cost_name = "";
			switch($scope.filter3)
			{
			case "users":
				cost_name = "cpu";
				break;
			case "new users":
				cost_name = "cpnu";
				break;
			case "conversions":
				cost_name = "cpc";
				break;
			}

			$scope.CpU = 0;
			$scope.CpNU = 0;
			$scope.CpC = 0;
			$scope["users"] = 0;
			$scope["new users"] = 0;
			$scope["conversions"] = 0;
			$scope.records = [];
			$scope.user_type_array = [];
			$scope.series = [];
			$scope.palette = [];
			if($scope.filter3 == "Users" || $scope.filter3 == "Conversions")
				$scope.user_type_array.push("Returning Visitor");
			if($scope.filter3 == "New Users" || $scope.filter3 == "Conversions")
				$scope.user_type_array.push("New Visitor");
			$scope.sampleData = [];
			$scope.dataSource = [];
			var data = {"tab_name" : $scope.filter1, 
			"combine_name" : $scope.filter2,
			"user_type_array" : $scope.user_type_array};

			$.ajax({
				type: 'POST',
				data: data,
			    url: 'performance_dataset',	
			    success: function(data) {
			    	$scope.data = data;
			    	var i = 0;
			    	var mp_data;
			    	for (var key1 in data) {
			    		//sampleData.push({"x": Number(data[key]["response"]/26), "y": Number(data[key]["revenue"]/2000)});
			    		if($scope.filter2){
			    			for (var key2 in data[key1]) {
			    				var temp_data = {};

			    				temp_data["name"] = key1+","+key2;
			    				temp_data["budget"] = Math.round(data[key1][key2]["cost"]);
			    				temp_data["users"] = Number(data[key1][key2]["users"]);
			    				temp_data["new users"] = Number(data[key1][key2]["new users"]);
			    				temp_data["conversions"] = Number(data[key1][key2]["conversions"]);
			    				temp_data["revenue"] = Number(data[key1][key2]["revenue"]);
			    				temp_data["ads"] = Number(data[key1][key2]["ads"]);
			    				temp_data["roi"] = Math.round(data[key1][key2]["roi"]*100/data[key1][key2]["ads"])+"%";	
			    				mp_data = data[key1][key2];	
			    				mp_data["ads"+"_"+key1] = mp_data["ads"];
			    				mp_data["cost"+"_"+key1] = Math.round(mp_data[cost_name]/mp_data[$scope.filter3]);
					    		mp_data["responses"+"_"+key1] = Math.round(mp_data[$scope.filter3]/100)/10;
					    		mp_data["maininfo"] = "sdf"
					    		mp_data[key1] = key1+"_"+key2;

					    		$scope.dataSource.push(mp_data);
								$scope.records.push(temp_data);
			    				$scope.CpU += data[key1][key2]["cpu"];
			    				$scope.CpNU += data[key1][key2]["cpnu"];
			    				$scope.CpC += Number(data[key1][key2]["cpc"]);
			    				$scope["users"] += Number(data[key1][key2]["users"]);
			    				$scope["new users"] += Number(data[key1][key2]["new users"]);
			    				$scope["conversions"] += Number(data[key1][key2]["conversions"]);
			    				$scope.ads += data[key1][key2]["ads"];
			    			}
			    		}else{
		    				var temp_data = {};
			    			temp_data["name"] = key1;
			    			temp_data["budget"] = Math.round(data[key1]["cost"]);
		    				temp_data["users"] = Number(data[key1]["users"]);
		    				temp_data["new users"] = Number(data[key1]["new users"]);
		    				temp_data["conversions"] = Number(data[key1]["conversions"]);
			    			temp_data["revenue"] = Number(data[key1]["revenue"]);
			    			temp_data["ads"] = Number(data[key1]["ads"]);
			    			temp_data["roi"] = Math.round(data[key1]["roi"]*100/data[key1]["ads"])+"%";
		    				$scope.records.push(temp_data);
			    			$scope.CpU += data[key1]["cpu"];
			    			$scope.CpNU += data[key1]["cpnu"];
			    			$scope.CpC += Number(data[key1]["cpc"]);
			    			$scope["users"] += Number(data[key1]["users"]);
			    			$scope["new users"] += Number(data[key1]["new users"]);
			    			$scope["conversions"] += Number(data[key1]["conversions"]);
			    			$scope.ads += data[key1]["ads"];
			    			mp_data = data[key1];


			    			mp_data["cost"+"_"+key1] = Math.round(mp_data[cost_name]/mp_data[$scope.filter3]);
					    	mp_data["responses"+"_"+key1] = Math.round(mp_data[$scope.filter3]/100)/10;
					    	mp_data["ads"+"_"+key1] = mp_data[$scope.filter3];
					    	mp_data["maininfo"] = "sdf";
					    	mp_data[key1] = key1;

					    	$scope.dataSource.push(mp_data);
			    			
			    		}

			    		var color = hslToHex(Math.random(),0.5, 0.5);
			    		$scope.palette.push(color);
						$scope.series.push({
			    			name: key1,
							argumentField: 'responses'+"_"+key1,
							valueField: 'cost'+"_"+key1,
							sizeField: 'ads'+"_"+key1,
							tagField: key1,
							color: color
			    		});
			    		
			    		i++;
			    	};
			    	$scope.$apply();
			    	$scope.updateChart();
			    	$scope.updateTable();
			    	$scope.updateCounters();
			    	$scope.updateTotal();
			    }
			});
		}

		function componentToHex(c) {
		    var hex = c.toString(16);
		    return hex.length == 1 ? "0" + hex : hex;
		}
		function rgbToHex(r, g, b) {
		    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
		}
		function hslToHex(h, s, l){
		    var r, g, b;

		    if(s == 0){
		        r = g = b = l; // achromatic
		    }else{
		        var hue2rgb = function hue2rgb(p, q, t){
		            if(t < 0) t += 1;
		            if(t > 1) t -= 1;
		            if(t < 1/6) return p + (q - p) * 6 * t;
		            if(t < 1/2) return q;
		            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		            return p;
		        }

		        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		        var p = 2 * l - q;
		        r = hue2rgb(p, q, h + 1/3);
		        g = hue2rgb(p, q, h);
		        b = hue2rgb(p, q, h - 1/3);
		    }
		    return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
		}

		d3.selection.prototype.moveToFront = function() {
		  return this.each(function(){
		    this.parentNode.appendChild(this);
		  });
		};



		$scope.initChart = function(){
			$scope.performanceChart = $element.find("#bar-6").dxChart({
				dataSource: $scope.dataSource,
				commonSeriesSettings: {
					type: 'bubble',
					point: {
			            hoverStyle: {
			                width: 3
			            }
			        },
			        opacity: 1,
			        commonSeriesSettings: {
				        hoverMode: 'allArgumentPoints'
				    }
				},
				tooltip: {
					enabled: true,
					location: "edge",
			        customizeTooltip: function (arg) {
			            return {
			                html: '<div style="text-align:right">' + arg.point.tag + '<br/>Users: ' + arg.argumentText + 'K <br/>CpU: $' + arg.valueText + '</div>'
			            };
			        }
				},
				argumentAxis: {
					label: {
						customizeText: function () {
							return this.value + 'K';
						}
					},
					title: 'Users'
				},
				valueAxis: {
					label: {
						customizeText: function () {
							return "$" + this.value;
						}
					},
					title: 'Avg Cost per User'
				},
				legend: {
					visible: false,
				},
				palette: $scope.palette,
				onPointHoverChanged: function (info) {
					var clickedPoint = info.target;
					var tags = clickedPoint.tag.split('_');
					var tmp_data;
					if(tags.length == 1)
					{
						tmp_data = $scope.data[tags[0]];
					}else if(tags.length == 2){
						tmp_data = $scope.data[tags[0]][tags[1]];
					}
					if (clickedPoint.isHovered()) {
			            $("#cpu_num").html("$"+Math.round(tmp_data["cpu"]/tmp_data["users"]));
						$("#cpnu_num").html("$"+Math.round(tmp_data["cpnu"]/tmp_data["new users"]));
						$("#cpc_num").html("$"+Math.round(Number(tmp_data["cpc"])/tmp_data["conversions"]));
			        } else {
			            $("#cpu_num").html("$"+Math.round($scope.CpU/$scope["users"]));
			            $("#cpnu_num").html("$"+Math.round($scope.CpNU/$scope["new users"]));
			            $("#cpc_num").html("$"+Math.round($scope.CpC/$scope["conversions"]));
			        }
			    },
		        onPointClick: function (info) {
		            var clickedPoint = info.target;
		            clickedPoint.isSelected() ? clickedPoint.clearSelection() : clickedPoint.select();
		        },
		        onPointSelectionChanged: function (info) {
		            var selectedPoint = info.target;
		            
		            if (selectedPoint.isSelected()) {
		            	var tags = selectedPoint.tag.split('_');
						var key;
						if(tags.length == 1)
						{
							key = tags[0];
						}else if(tags.length == 2){
							key = tags[0]+','+tags[1];
						}
						$element.find("#result_table tr").removeClass('selected');
					    $element.find("#result_table tr[title='"+key+"']").addClass('selected');
					    $element.find("#result_table tr.selected").prependTo("#result_table tbody");
		            } else {
						$element.find("#result_table tr").removeClass('selected');
		            }
		        },
				series: $scope.series,
				scrollBar: {
			        visible: true
			    },
			    scrollingMode: "all", 
			    zoomingMode: "all",
			}).dxChart("instance");
		}
		$scope.updateCounters = function() {
            $("#cpu_num").html("$"+Math.round($scope.CpU/$scope["users"]));
            $("#cpnu_num").html("$"+Math.round($scope.CpNU/$scope["new users"]));
            $("#cpc_num").html("$"+Math.round($scope.CpC/$scope["conversions"]));
		}
		$scope.updateTotal = function(){
			$scope.total.ads = 0;
			$scope.total.budget = 0;
			$scope.total.revenue = 0;
			$scope.total["users"] = 0;
			$scope.total["new users"] = 0;
			$scope.total["conversions"] = 0;
			for(var i=0; i<$scope.records.length; i++) {
				$scope.total.ads += parseInt($scope.records[i].ads) || 0;
				$scope.total.budget += parseInt($scope.records[i].budget) || 0;
				$scope.total.revenue += parseInt($scope.records[i].revenue) || 0;
				$scope.total["users"] += parseInt($scope.records[i]["users"]) || 0;
				$scope.total["new users"] += parseInt($scope.records[i]["new users"]) || 0;
				$scope.total["conversions"] += parseInt($scope.records[i]["conversions"]) || 0;
			}


			var tr = $("<tr class='total'><th colspan='1' id='result_table-col-0-clone'></th><th data-priority='1' id='result_table-col-1-clone'></th><th data-priority='2' id='result_table-col-2-clone'></th><th data-priority='7' id='result_table-col-3-clone'></th><th data-priority='4' id='result_table-col-4-clone'></th><th data-priority='5' id='result_table-col-5-clone'></th><th data-priority='7' id='result_table-col-6-clone'></th><th data-priority='7' id='result_table-col-7-clone'></th></tr>");	
			$(tr).addClass('bg-info');
			for(var i=1; i<=$element.find("#result_table-clone thead tr:last-child th").length; i++) {
				$element.find("#result_table thead tr:last-child th:nth-child("+i+")").is(":visible")?tr.find("th:nth-child("+i+")").css('display','table-cell'):tr.find("th:nth-child("+i+")").css('display','none');
			}	

			$(tr).find('th:nth-child(1)').html('Total');
			$(tr).find('th:nth-child(2)').html($scope.total.ads);
			$(tr).find('th:nth-child(3)').html($scope.total.budget);
			$(tr).find('th:nth-child(5)').html($scope.total.revenue);
			$(tr).find('th:nth-child(6)').html($scope.total.users);
			$(tr).find('th:nth-child(7)').html($scope.total["new users"]);
			$(tr).find('th:nth-child(8)').html($scope.total.conversions);
			
			$element.find('#result_table-clone thead tr.total').remove();
			$element.find('#result_table thead tr.total').remove();
			$element.find('#result_table-clone thead').prepend(tr);
			$element.find('#result_table thead').prepend(tr.clone());
		}
		$scope.updateTable = function() {
			var table = $element.find("#result_table");
			var table_clone = $element.find("#result_table-clone");
			var tr = $("<tr><td colspan='1' data-columns='result_table-col-0'></td><td data-priority='1' data-columns='result_table-col-1'></td><td data-priority='2' data-columns='result_table-col-2'></td><td data-priority='7' data-columns='result_table-col-3'></td><td data-priority='4' data-columns='result_table-col-4'></td><td data-priority='5' data-columns='result_table-col-5'></td><td data-priority='7' data-columns='result_table-col-6'></td><td data-priority='7' data-columns='result_table-col-7'></td></tr>");
					
			for(var i=1; i<=$(table).find("thead tr th").length; i++) {
				$(table).find("thead tr th:nth-child("+i+")").is(":visible")?tr.find("td:nth-child("+i+")").css('display','table-cell'):tr.find("td:nth-child("+i+")").css('display','none');
			}	
			$(table).DataTable().clear();
			$(table_clone).DataTable().clear();
			var column_list = ['name','ads','budget','roi','revenue','users','new users','conversions'];
			for(var i=0; i<$scope.records.length; i++) {
				var new_tr = $(tr).clone();
				new_tr.attr('title', $scope.records[i].name);
				for(var j=0; j<column_list.length; j++) {
					new_tr.find("td:nth-child("+(j+1)+")").html($scope.records[i][column_list[j]]);
				}
				$(table).DataTable().row.add(new_tr);
				$(table_clone).DataTable().row.add(new_tr);
			}

			$(table_clone).on( 'draw.dt', function () {
			    $(table).find('tbody').html($(table_clone).find('tbody').html());
			} );

			$(table).DataTable().draw();
			$(table_clone).DataTable().draw();
		}
		$scope.updateChart = function(){
			$scope.performanceChart.option({
				dataSource: $scope.dataSource,
				palette: $scope.palette,
				series: $scope.series
			});
		}

		$scope.$watch(function(scope){return scope.filter3},function(){
			$scope.LoadData();

			var argumentTitle, valueTitle, shortArgumentTitle;

			switch($scope.filter3) {
				case 'users':
					argumentTitle = "Users";
					valueTitle = "Avg Cost per User";
					shortArgumentTitle = "CpU";
					break;
				case 'new users':
					argumentTitle = "New Users";
					valueTitle = "Avg Cost per New User";
					shortArgumentTitle = "CpNU";
					break;
				case 'conversions':
					argumentTitle = "Conversions";
					valueTitle = "Avg Cost per Conversion";
					shortArgumentTitle = "CpC";
					break;
			}

			$scope.performanceChart.option({
				argumentAxis: {
					title: argumentTitle
				},
				valueAxis: {
					title: valueTitle
				},
				tooltip: {
			        customizeTooltip: function (arg) {
			            return {
			                html: '<div style="text-align:right">' + arg.point.tag + '<br/>' + argumentTitle + ': ' + arg.argumentText + 'K <br/>' + shortArgumentTitle + ': $' + arg.valueText + '</div>'
			            };
			        }
				},
			});

		});

		jQuery(document).ready(function(){
			$scope.initChart();
		});
	}).
	controller('TrendsPageCtrl', function($scope, $element, $rootScope, $compile){
		$rootScope.page_title = "Trends";
		$rootScope.exportTableSelector = '.trend-table';

		$scope.filter1 = 'Day';
		$scope.tablerows = ['Breakfast','Coffee','Daytime','PrePeak','EarlyPeak','LatePeak','PostPeak','Total'];
		$scope.tabledataset = new Array(8);
        for (var i = 0; i < 8; i++) {
        	$scope.tabledataset[i] = new Array(8);
        	for(var j = 0; j < 8; j++)
        		$scope.tabledataset[i][j] = 0;
        };

        

		$scope.addColorVariation = function() {

		    // get all values
		    var counts= $element.find('.trend-table tbody td').not('.last').map(function() {
		        return parseInt($(this).text().replace('$', ''));
		    }).get();
			
			// return max value
			var max = Math.max.apply(Math, counts);
			
			var xr = 255,
		    	xg = 255,
		    	xb = 255,

		   		yr = 247,
		    	yg = 170,
		    	yb = 71,

		    	n = 100;

			// add classes to cells based on nearest 10 value
			$element.find('.trend-table tbody td').each(function(){
				var val = parseInt($(this).text().replace('$', '')),
					pos = parseInt((Math.round((val/max)*100)).toFixed(0)),
					red = parseInt((xr + (( pos * (yr - xr)) / (n-1))).toFixed(0)),
					green = parseInt((xg + (( pos * (yg - xg)) / (n-1))).toFixed(0)),
					blue = parseInt((xb + (( pos * (yb - xb)) / (n-1))).toFixed(0)),
					clr = 'rgb('+red+','+green+','+blue+')';
				
				$(this).css({backgroundColor:clr});
			});
		}
		$scope.getAVG = function(e, dataSource, field) {
			var total = 0,
				avg = 0,
				count = 0;
			for(var i=0; i<dataSource.length; i++)
			{
				if(e.startValue<=dataSource[i].t && (total == 0 || e.endValue>=dataSource[i].t)) {
					total += dataSource[i][field];
					count ++;
				}
			}
			avg = total / count;
			return avg;
		}
		$scope.getTotal = function(e, dataSource, field) {
			var total = 0;
			for(var i=0; i<dataSource.length; i++)
			{
				if(e.startValue<=dataSource[i].t && (total == 0 || e.endValue>=dataSource[i].t)) {
					total += dataSource[i][field];
				}
			}
			return Math.round(total/7);
		}
		$scope.randomDataSourceForHour = function(dataSource) {
			var result = [];
			for(var i=0; i<dataSource.length-1; i++) {
				for(var j=0; j<24; j++) {					
					var temp = jQuery.extend(true, {}, dataSource[i]);
					temp.t = new Date(temp.t.setHours(j));
					for (var key in temp) {
						if(key!='t')
					    	temp[key] = 2*dataSource[i][key] - dataSource[i+1][key] + between(0, dataSource[i+1][key]-dataSource[i][key])*2;
					}
					result.push(temp);
				}
			}
			result.push(dataSource[dataSource.length-1]);
			return result;
		}
		$scope.getDataSourceFor = function(dataSource, unit) {
			var result = [];
			var u, start;

			switch(unit) {
				case 'Day':
					u = 1;
					start = 0;
					break;
				case 'Week':
					u = 7;
					start = 3;
					break;
				case 'Month':
					u = 15;
					start = 7;
					break;
			}
			result.push(dataSource[0]);
			for(var i=start; i<dataSource.length; i++){
				if((i-start)%u == 0)
					result.push(dataSource[i]);
			}
			result.push(dataSource[dataSource.length-1]);
			return result;
		}

		$scope.initRangeCharts = function() {

			if( ! $.isFunction($.fn.dxChart))
				return;
			
			$scope.dataSource1 = [
				{ t: new Date(2015, 4, 1), users: 5567, new_users: 3340, conversion: 501 },
				{ t: new Date(2015, 4, 2), users: 5903, new_users: 3542, conversion: 531 },
				{ t: new Date(2015, 4, 3), users: 6810, new_users: 4086, conversion: 613 },
				{ t: new Date(2015, 4, 4), users: 7230, new_users: 4338, conversion: 651 },
				{ t: new Date(2015, 4, 5), users: 5001, new_users: 3001, conversion: 450 },
				{ t: new Date(2015, 4, 6), users: 4689, new_users: 2813, conversion: 422 },
				{ t: new Date(2015, 4, 7), users: 4543, new_users: 2726, conversion: 409 },
				{ t: new Date(2015, 4, 8), users: 4123, new_users: 2474, conversion: 371 },
				{ t: new Date(2015, 4, 9), users: 7659, new_users: 4595, conversion: 689 },
				{ t: new Date(2015, 4, 10), users: 7932, new_users: 4759, conversion: 714 },
				{ t: new Date(2015, 4, 11), users: 8123, new_users: 4874, conversion: 731 },
				{ t: new Date(2015, 4, 12), users: 7642, new_users: 4585, conversion: 688 },
				{ t: new Date(2015, 4, 13), users: 6534, new_users: 3920, conversion: 588 },
				{ t: new Date(2015, 4, 14), users: 4324, new_users: 2594, conversion: 389 },
				{ t: new Date(2015, 4, 15), users: 4002, new_users: 2401, conversion: 360 },
				{ t: new Date(2015, 4, 16), users: 3987, new_users: 2392, conversion: 359 },
				{ t: new Date(2015, 4, 17), users: 4322, new_users: 2593, conversion: 389 },
				{ t: new Date(2015, 4, 18), users: 4103, new_users: 2462, conversion: 369 },
				{ t: new Date(2015, 4, 19), users: 4569, new_users: 2741, conversion: 411 },
				{ t: new Date(2015, 4, 20), users: 4354, new_users: 2612, conversion: 392 },
				{ t: new Date(2015, 4, 21), users: 4321, new_users: 2593, conversion: 449 },
				{ t: new Date(2015, 4, 22), users: 4986, new_users: 2992, conversion: 351 },
				{ t: new Date(2015, 4, 23), users: 3897, new_users: 2338, conversion: 324 },
				{ t: new Date(2015, 4, 24), users: 3596, new_users: 2158, conversion: 355 },
				{ t: new Date(2015, 4, 25), users: 3945, new_users: 2367, conversion: 317 },
				{ t: new Date(2015, 4, 26), users: 3523, new_users: 2114, conversion: 490 },
				{ t: new Date(2015, 4, 27), users: 5439, new_users: 3263, conversion: 389 },
				{ t: new Date(2015, 4, 28), users: 4321, new_users: 2593, conversion: 410 },
				{ t: new Date(2015, 4, 29), users: 4555, new_users: 2733, conversion: 389 }
			];
			$scope.dataSourceExtended1 = $scope.randomDataSourceForHour($scope.dataSource1);

			$scope.lineChart1 = $element.find("#range-1").dxRangeSelector({
				scale: {
					minorTickInterval: "day",
					majorTickInterval: {
						days: 7
					}
				},
				size: {
					height: 200
				},
				sliderMarker: {
					format: "MMM dd",
				},
				dataSource: $scope.dataSource1,
				chart: {
					series: [
						{ type: "line", argumentField: "t", valueField: "users", color: "#68B828" },
						{ type: "line", argumentField: "t", valueField: "new_users", color: "#04B486" },
						{ type: "line", argumentField: "t", valueField: "conversion", color: "#037E5E" }
					],
					valueAxis: {
						min: 0
					}
				},
				selectedRange: {
					startValue: new Date(2015, 4, 14),
					endValue: new Date(2015, 4, 21)
				},
				selectedRangeChanged: function(e)
				{
					$scope.lineChart2.setSelectedRange(e);
					$scope.lineChart3.setSelectedRange(e);
					$scope.update(e);
				}
			}).dxRangeSelector('instance');



			$scope.dataSource2 = [
				{ t: new Date(2015, 4, 1), cpu: 75, cpnu: 130, cpc: 142 },
				{ t: new Date(2015, 4, 2), cpu: 55, cpnu: 140, cpc: 172 },
				{ t: new Date(2015, 4, 3), cpu: 95, cpnu: 117, cpc: 149 },
				{ t: new Date(2015, 4, 4), cpu: 89, cpnu: 99, cpc: 162 },
				{ t: new Date(2015, 4, 5), cpu: 112, cpnu: 113, cpc: 150 },
				{ t: new Date(2015, 4, 6), cpu: 72, cpnu: 83, cpc: 160 },
				{ t: new Date(2015, 4, 7), cpu: 88, cpnu: 123, cpc: 134 },
				{ t: new Date(2015, 4, 8), cpu: 102, cpnu: 139, cpc: 150 },
				{ t: new Date(2015, 4, 9), cpu: 97, cpnu: 99, cpc: 134 },
				{ t: new Date(2015, 4, 10), cpu: 69, cpnu: 129, cpc: 164 },
				{ t: new Date(2015, 4, 11), cpu: 88, cpnu: 92, cpc: 149 },
				{ t: new Date(2015, 4, 12), cpu: 89, cpnu: 113, cpc: 174 },
				{ t: new Date(2015, 4, 13), cpu: 56, cpnu: 106, cpc: 129 },
				{ t: new Date(2015, 4, 14), cpu: 76, cpnu: 136, cpc: 152 },
				{ t: new Date(2015, 4, 15), cpu: 92, cpnu: 156, cpc: 179 },
				{ t: new Date(2015, 4, 16), cpu: 61, cpnu: 126, cpc: 149 },
				{ t: new Date(2015, 4, 17), cpu: 78, cpnu: 113, cpc: 119 },
				{ t: new Date(2015, 4, 18), cpu: 103, cpnu: 147, cpc: 151 },
				{ t: new Date(2015, 4, 19), cpu: 88, cpnu: 126, cpc: 141 },
				{ t: new Date(2015, 4, 20), cpu: 112, cpnu: 151, cpc: 171 },
				{ t: new Date(2015, 4, 21), cpu: 72, cpnu: 112, cpc: 148 },
				{ t: new Date(2015, 4, 22), cpu: 79, cpnu: 123, cpc: 158 },
				{ t: new Date(2015, 4, 23), cpu: 66, cpnu: 100, cpc: 128 },
				{ t: new Date(2015, 4, 24), cpu: 80, cpnu: 101, cpc: 138 },
				{ t: new Date(2015, 4, 25), cpu: 44, cpnu: 130, cpc: 169 },
				{ t: new Date(2015, 4, 26), cpu: 64, cpnu: 90, cpc: 139 },
				{ t: new Date(2015, 4, 27), cpu: 84, cpnu: 130, cpc: 171 },
				{ t: new Date(2015, 4, 28), cpu: 69, cpnu: 86, cpc: 159 },
				{ t: new Date(2015, 4, 29), cpu: 100, cpnu: 121, cpc: 150 }
			];
			$scope.dataSourceExtended2 = $scope.randomDataSourceForHour($scope.dataSource2);

			$scope.lineChart2 = $element.find("#range-2").dxRangeSelector({
				scale: {
					minorTickInterval: "day",
					majorTickInterval: {
						days: 7
					}
				},
				size: {
					height: 200
				},
				sliderMarker: {
					format: "MMM dd",
				},
				dataSource: $scope.dataSource2,
				chart: {
					series: [
						{ type: "line", argumentField: "t", valueField: "cpu", color: "#FED474" },
						{ type: "line", argumentField: "t", valueField: "cpnu", color: "#F1BD60" },
						{ type: "line", argumentField: "t", valueField: "cpc", color: "#C18454" }
					],
					valueAxis: {
						min: 0
					}
				},
				selectedRange: {
					startValue: new Date(2015, 4, 14),
					endValue: new Date(2015, 4, 21)
				},
				selectedRangeChanged: function(e)
				{
					$scope.lineChart1.setSelectedRange(e);
					$scope.lineChart3.setSelectedRange(e);
					$scope.update(e);
				}
			}).dxRangeSelector('instance');

			$scope.dataSource3 = [
				{ t: new Date(2015, 4, 1), budget: 621, ads: 1450, revenue: 1230 },
				{ t: new Date(2015, 4, 2), budget: 550, ads: 1750, revenue: 1830 },
				{ t: new Date(2015, 4, 3), budget: 671, ads: 1280, revenue: 1430 },
				{ t: new Date(2015, 4, 4), budget: 525, ads: 750, revenue: 2230 },
				{ t: new Date(2015, 4, 5), budget: 612, ads: 1130, revenue: 1250 },
				{ t: new Date(2015, 4, 6), budget: 490, ads: 1630, revenue: 850 },
				{ t: new Date(2015, 4, 7), budget: 689, ads: 1330, revenue: 1550 },
				{ t: new Date(2015, 4, 8), budget: 812, ads: 930, revenue: 2450 },
				{ t: new Date(2015, 4, 9), budget: 689, ads: 1450, revenue: 1545 },
				{ t: new Date(2015, 4, 10), budget: 820, ads: 1850, revenue: 845 },
				{ t: new Date(2015, 4, 11), budget: 790, ads: 1650, revenue: 1345 },
				{ t: new Date(2015, 4, 12), budget: 912, ads: 1050, revenue: 1945 },
				{ t: new Date(2015, 4, 13), budget: 1123, ads: 1480, revenue: 2262 },
				{ t: new Date(2015, 4, 14), budget: 812, ads: 1280, revenue: 2062 },
				{ t: new Date(2015, 4, 15), budget: 1034, ads: 1680, revenue: 1562 },
				{ t: new Date(2015, 4, 16), budget: 1236, ads: 1380, revenue: 1962 },
				{ t: new Date(2015, 4, 17), budget: 923, ads: 1070, revenue: 2612 },
				{ t: new Date(2015, 4, 18), budget: 1304, ads: 1500, revenue: 2012 },
				{ t: new Date(2015, 4, 19), budget: 743, ads: 1250, revenue: 2412 },
				{ t: new Date(2015, 4, 20), budget: 601, ads: 1600, revenue: 1812 },
				{ t: new Date(2015, 4, 21), budget: 904, ads: 1200, revenue: 2476 },
				{ t: new Date(2015, 4, 22), budget: 1307, ads: 1380, revenue: 2876 },
				{ t: new Date(2015, 4, 23), budget: 1642, ads: 1780, revenue: 2076 },
				{ t: new Date(2015, 4, 24), budget: 1405, ads: 1480, revenue: 1476 },
				{ t: new Date(2015, 4, 25), budget: 960, ads: 1120, revenue: 2134 },
				{ t: new Date(2015, 4, 26), budget: 740, ads: 1020, revenue: 1634 },
				{ t: new Date(2015, 4, 27), budget: 1030, ads: 1320, revenue: 2234 },
				{ t: new Date(2015, 4, 28), budget: 890, ads: 1120, revenue: 2634 },
				{ t: new Date(2015, 4, 29), budget: 680, ads: 880, revenue: 1923 }
			];
			$scope.dataSourceExtended3 = $scope.randomDataSourceForHour($scope.dataSource3);

			$scope.lineChart3 = $element.find("#range-3").dxRangeSelector({
				scale: {
					minorTickInterval: "day",
					majorTickInterval: {
						days: 7
					}
				},
				size: {
					height: 200
				},
				sliderMarker: {
					format: "MMM dd",
				},
				dataSource: $scope.dataSource3,
				chart: {
					series: [
						{ type: "line", argumentField: "t", valueField: "budget", color: "#ABC7D9" },
						{ type: "line", argumentField: "t", valueField: "ads", color: "#4C6474" },
						{ type: "line", argumentField: "t", valueField: "revenue", color: "#354651" }
					],
					valueAxis: {
						min: 0
					}
				},
				selectedRange: {
					startValue: new Date(2015, 4, 14),
					endValue: new Date(2015, 4, 21)
				},
				selectedRangeChanged: function(e)
				{
					$scope.lineChart1.setSelectedRange(e);
					$scope.lineChart2.setSelectedRange(e);
					$scope.update(e);
				}
			}).dxRangeSelector('instance');
		}

		$scope.updateCounters = function(e){
			$scope.users = Math.round($scope.getTotal(e, $scope.dataSource1, 'users')*5.7);
			$scope.new_users = Math.round($scope.getTotal(e, $scope.dataSource1, 'new_users')*5.7);
			$scope.conversion = Math.round($scope.getTotal(e, $scope.dataSource1, 'conversion')*5.7);
			$scope.cpu = Math.round($scope.getAVG(e, $scope.dataSource2, 'cpu'));
			$scope.cpnu = Math.round($scope.getAVG(e, $scope.dataSource2, 'cpnu'));
			$scope.cpc = Math.round($scope.getAVG(e, $scope.dataSource2, 'cpc'));
			$scope.budget = $scope.users * $scope.cpu;
			$scope.ads = Math.round($scope.getTotal(e, $scope.dataSource3, 'ads'));
			$scope.revenue = Math.round($scope.getTotal(e, $scope.dataSource3, 'revenue'))*188;
			if($scope.revenue>1437435) $scope.revenue = 1437435;

			var usersCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.users+'" data-decimal="," data-duration="1.5">'+$scope.users+'</label>');
			$element.find('.users-counter').html($compile(usersCounterHtml)($scope));
			var newUsersCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.new_users+'" data-decimal="," data-duration="1.5">'+$scope.new_users+'</label>');
			$element.find('.newusers-counter').html($compile(newUsersCounterHtml)($scope));
			var conversionCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.conversion+'" data-decimal="," data-duration="1.5">'+$scope.conversion+'</label>');
			$element.find('.conversion-counter').html($compile(conversionCounterHtml)($scope));
			var cpuCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.cpu+'" data-decimal="," data-duration="1.5" data-prefix="$">$'+$scope.cpu+'</label>');
			$element.find('.cpu-counter').html($compile(cpuCounterHtml)($scope));
			var cpnuCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.cpnu+'" data-decimal="," data-duration="1.5" data-prefix="$">$'+$scope.cpnu+'</label>');
			$element.find('.cpnu-counter').html($compile(cpnuCounterHtml)($scope));
			var cpcCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.cpc+'" data-decimal="," data-duration="1.5" data-prefix="$">$'+$scope.cpc+'</label>');
			$element.find('.cpc-counter').html($compile(cpcCounterHtml)($scope));
			var budgetCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.budget+'" data-decimal="," data-prefix="$" data-duration="1.5">$'+$scope.budget+'</label>');
			$element.find('.budget-counter').html($compile(budgetCounterHtml)($scope));
			var adsCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.ads+'" data-decimal="," data-duration="1.5">'+$scope.ads+'</label>');
			$element.find('.ads-counter').html($compile(adsCounterHtml)($scope));
			var revenueCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.revenue+'" data-decimal="," data-prefix="$" data-duration="1.5">$'+$scope.revenue+'</label>');
			$element.find('.revenue-counter').html($compile(revenueCounterHtml)($scope));
		}

		$scope.updateTable = function(e){
			$.ajax({
				type: 'POST',
				data: {'daterange':e},
			    url: 'trends_dataset',	
			    success: function(res) {
			    	$scope.tabledataset = res.data_matrix;
					$scope.$apply();
					$scope.addColorVariation();
			    }
			});
		}

		$scope.update = function(e) {
			$scope.updateCounters(e);
			$scope.updateTable(e);
		}

		//  Hour/Day/week/Month
		$scope.$watch(function(scope) { return scope.filter1 },
            function() {
            	switch($scope.filter1) {
            		case "Day":
            			$scope.lineChart1.option({
            				dataSource: $scope.dataSource1,
            				scale: {
								minorTickInterval: "day",
								majorTickInterval: {
									days: 1
								}
							},
            			});
            			$scope.lineChart2.option({
            				dataSource: $scope.dataSource2,
            				scale: {
								minorTickInterval: "day",
								majorTickInterval: {
									days: 1
								}
							},
            			});
            			$scope.lineChart3.option({
            				dataSource: $scope.dataSource3,
            				scale: {
								minorTickInterval: "day",
								majorTickInterval: {
									days: 1
								}
							},
            			});
            			break;
            		case "Week":
            			$scope.lineChart1.option({
            				dataSource: $scope.getDataSourceFor($scope.dataSource1, 'Week'),
            				scale: {
								minorTickInterval: "week",
								majorTickInterval: {
									days: 7
								}
							},
            			});
            			$scope.lineChart2.option({
            				dataSource: $scope.getDataSourceFor($scope.dataSource2, 'Week'),
            				scale: {
								minorTickInterval: "week",
								majorTickInterval: {
									days: 7
								}
							},
            			});
            			$scope.lineChart3.option({
            				dataSource: $scope.getDataSourceFor($scope.dataSource3, 'Week'),
            				scale: {
								minorTickInterval: "week",
								majorTickInterval: {
									days: 7
								}
							},
            			});
            			break;
            		case "Month":
            			$scope.lineChart1.option({
            				dataSource: $scope.getDataSourceFor($scope.dataSource1, 'Month'),
            				scale: {
								minorTickInterval: "week",
								majorTickInterval: {
									days: 7
								}
							},
            			});
            			$scope.lineChart2.option({
            				dataSource: $scope.getDataSourceFor($scope.dataSource2, 'Month'),
            				scale: {
								minorTickInterval: "week",
								majorTickInterval: {
									days: 7
								}
							},
            			});
            			$scope.lineChart3.option({
            				dataSource: $scope.getDataSourceFor($scope.dataSource3, 'Month'),
            				scale: {
								minorTickInterval: "week",
								majorTickInterval: {
									days: 7
								}
							},
            			});
            			break;
            		case "Hour":
            			$scope.lineChart1.option({
            				dataSource: $scope.dataSourceExtended1,
            				scale: {
								minorTickInterval: "hour",
								majorTickInterval: {
									hours: 3,
									days: 0
								}
							},
            			});
            			$scope.lineChart2.option({
            				dataSource: $scope.dataSourceExtended2,
            				scale: {
								minorTickInterval: "hour",
								majorTickInterval: {
									hours: 3,
									days: 0
								}
							},
            			});
            			$scope.lineChart3.option({
            				dataSource: $scope.dataSourceExtended3,
            				scale: {
								minorTickInterval: "hour",
								majorTickInterval: {
									hours: 3,
									days: 0
								}
							},
            			});
            			break;
            	}
        });
				
		jQuery(document).ready(function(){
			$scope.initRangeCharts();
			$scope.update($scope.lineChart1.getSelectedRange());
		});
	}).
	controller('RoiPageCtrl', function($scope, $rootScope, $window, $compile){
		$rootScope.page_title = "ROI";


		$scope.filter1 = 'networks';
		$scope.filter3 = "users"
		var w = angular.element($window);

		w.bind('resize', function () {
			var element = $("#chart");
			resizeTreemap(element, $scope.dataset);
			//drawZoomablTreemap(element, $scope.dataset);
		});
		$scope.LoadData = function()
		{
			$scope.user_type_array = [];
			var element = $("#chart");
			
			if($scope.filter3 == "Users" || $scope.filter3 == "Conversions")
				$scope.user_type_array.push("Returning Visitor");
			if($scope.filter3 == "New Users" || $scope.filter3 == "Conversions")
				$scope.user_type_array.push("New Visitor");
			var data = {"tab_name" : $scope.filter1, 
			"combine_name" : $scope.filter2,
			"user_type_array" : $scope.user_type_array};
			$.ajax({
				type: 'POST',
				data: data,
			    url: 'roi_dataset',	
			    success: function(res) {
			    	$scope.dataset = res.data;
			    	drawZoomablTreemap(element, res.data, $scope.filter3, $compile, $scope);
			    	drawBarCharts(res.data);
			    }
			});
			
		}
		$scope.LoadData();
	}).
	controller('PlannerPageCtrl', function($scope, $rootScope){
		$rootScope.page_title = "Planner";
		$rootScope.exportTableSelector = '.planner-table';

		$scope.filter = {};
		$scope.vertical_tabs = 1;
		$scope.filter_budget = '';
		$scope.network_list = [];
		$scope.filter_network = [{},{},{}];

		$scope.percent = function(value, total) {
			return Math.floor(value * 10000 / total) /100;
		}
		$scope.isVisible = function(item) {
			if($scope.filter_budget && parseFloat(item.budgets) > parseFloat($scope.filter_budget)) return false;

			var isVisible, existNetworkFilter=false;
			for(var i=0; i<$scope.filter_network.length; i++) {
				if($scope.filter_network[i].network && $scope.filter_network[i].network.trim() && $scope.filter_network[i].impressions && $scope.filter_network[i].impressions.trim())
					existNetworkFilter = true;

				if(item.network == $scope.filter_network[i].network && parseFloat(item.impressions) <= parseFloat($scope.filter_network[i].impressions)){

					isVisible = true;
					break;
				}
			}
			if(existNetworkFilter && !isVisible) return false;

			return true;
		}

		$.ajax({
			type: 'POST',
			data: {},
		    url: 'planner_dataset',	
		    success: function(res) {
		    	$scope.dataset = res.data;

		    	for(var i=0; i<$scope.dataset.length; i++) {
		    		$scope.dataset[i].impressions = $scope.dataset[i].impacts || 0;
		    		$scope.dataset[i].impression_p = $scope.percent($scope.dataset[i].impressions, res.sum_impression) || 0;
		    		$scope.dataset[i].budgets = Number($scope.dataset[i]["Sum of cost"].replace(",",".")) || 0;
		    		$scope.dataset[i].budget_p = $scope.percent($scope.dataset[i].budgets, res.sum_budget);
		    		$scope.dataset[i].cpc = $scope.dataset[i].cpc1;
		    		$scope.network_list = res.network_list;
		    	}
		    	$scope.$apply();
		    }
		});
	}).
	controller('BreakdownPageCtrl', function($scope, $rootScope, $element){
		$rootScope.page_title = "Breakdown";
		$rootScope.exportTableSelector = '.breakdown-table';
		$scope.filter = { 
			users: { startValue:100, endValue:1000 },
			new_users: { startValue:100, endValue:1000 },
			conversions: { startValue:100, endValue:1000 },
			cpu: { startValue:10, endValue:150 },
			cpnu: { startValue:10, endValue:150 },
			cpc: { startValue:10, endValue:150 },
			month: [],
			weekday: [],
			daypart: [],
			campaign: [],
			creative: [],
			'length': [],
			region: [],
			device: [],
			network: [],
			channel: [],
		};
		$scope.filter_option = "Total";

		$scope.dataset = [];

		$.ajax({
			type: 'POST',
			data: {},
		    url: 'breakdown_dataset',	
		    success: function(res) {
		    	$scope.dataset = res.data;
		    	$scope.filter_list = res.filter_list;

		    	for(var i=0; i<$scope.dataset.length; i++) {
					var temp = $scope.dataset[i].datetime.split(" ");
					$scope.dataset[i].date = temp[0];
					$scope.dataset[i].time = temp[1];
					$scope.dataset[i].month = $scope.dataset[i]['Month of datetime'];
					$scope.dataset[i].weekday = $scope.dataset[i]['Weekday of datetime'];
					$scope.dataset[i].users = between(100, 1000);
					$scope.dataset[i].new_users = between(100, 1000);
					$scope.dataset[i].conversions = between(100, 1000);
					$scope.dataset[i].cpu = between(10, 150);
					$scope.dataset[i].cpnu = between(10, 150);
					$scope.dataset[i].cpc = between(10, 150);
		    	}

		    	$scope.$apply();
		    	$scope.initMultiSelect();
		    }
		});

		function isEmptyList(arr) {
			for(var i=0; i<arr.length; i++) {
				if(arr[i]!='' && arr[i]!=null)
					return false;
			}
			return true;
		}
		$scope.isVisible = function(item) {
			//if(!isEmptyList($scope.filter.month) && $scope.filter.month.indexOf(item.month)==-1)
			//	return false;
			//if(!isEmptyList($scope.filter.weekday) && $scope.filter.weekday.indexOf(item.weekday)==-1)
			//	return false;
			if(!isEmptyList($scope.filter.daypart) && $scope.filter.daypart.indexOf(item.Daytime)==-1)
				return false;
			//if(!isEmptyList($scope.filter.campaign) && $scope.filter.campaign.indexOf(item.campaign)==-1)
			//	return false;
			if(!isEmptyList($scope.filter.creative) && $scope.filter.creative.indexOf(item.creative)==-1)
				return false;
			//if(!isEmptyList($scope.filter['length']) && $scope.filter['length'].indexOf(item['length'])==-1)
			//	return false;
			//if(!isEmptyList($scope.filter.region) && $scope.filter.region.indexOf(item.region)==-1)
			//	return false;
			if(!isEmptyList($scope.filter.device) && $scope.filter.device.indexOf(item.device)==-1)
				return false;
			if(!isEmptyList($scope.filter.network) && $scope.filter.network.indexOf(item.networks)==-1)
				return false;
			if(!isEmptyList($scope.filter.channel) && $scope.filter.channel.indexOf(item.channels)==-1)
				return false;

			if($scope.filter_option == "Total") {
				if($scope.filter.users.startValue>=item.users || $scope.filter.users.endValue<=item.users)
					return false;
				if($scope.filter.new_users.startValue>=item.new_users || $scope.filter.new_users.endValue<=item.new_users)
					return false;
				if($scope.filter.conversions.startValue>=item.conversions || $scope.filter.conversions.endValue<=item.conversions)
					return false;
			}
			else {
				if($scope.filter.cpu.startValue>=item.cpu || $scope.filter.cpu.endValue<=item.cpu)
					return false;
				if($scope.filter.cpnu.startValue>=item.cpnu || $scope.filter.cpnu.endValue<=item.cpnu)
					return false;
				if($scope.filter.cpc.startValue>=item.cpc || $scope.filter.cpc.endValue<=item.cpc)
					return false;
			}

			return true;
		}

		$scope.initCharts = function() {
			$element.find("#range-1").dxRangeSelector({
			    margin: {
			        top: 20
			    },
			    size: {
			        height: 140
			    },
			    scale: {
			        startValue: 100,
			        endValue: 1000,
			        minorTickInterval: 5,
			        majorTickInterval: 50,
			        showMinorTicks: false,
			    },
			    selectedRange: {
			        startValue: 100,
			        endValue: 1000
			    },
				selectedRangeChanged: function (e) {
					$scope.filter.users = e;
					$scope.$apply();
				}
			});


			$element.find("#range-2").dxRangeSelector({
			    margin: {
			        top: 20
			    },
			    size: {
			        height: 140
			    },
			    scale: {
			        startValue: 100,
			        endValue: 1000,
			        minorTickInterval: 5,
			        majorTickInterval: 50,
			        showMinorTicks: false,
			    },
			    selectedRange: {
			        startValue: 100,
			        endValue: 1000
			    },
				selectedRangeChanged: function (e) {
					$scope.filter.new_users = e;
					$scope.$apply();
				}
			});

			$element.find("#range-3").dxRangeSelector({
			    margin: {
			        top: 20
			    },
			    size: {
			        height: 140
			    },
			    scale: {
			        startValue: 100,
			        endValue: 1000,
			        minorTickInterval: 5,
			        majorTickInterval: 50,
			        showMinorTicks: false,
			    },
			    selectedRange: {
			        startValue: 100,
			        endValue: 1000
			    },
				selectedRangeChanged: function (e) {
					$scope.filter.conversions = e;
					$scope.$apply();
				}
			});
			$element.find("#range-4").dxRangeSelector({
			    margin: {
			        top: 20
			    },
			    size: {
			        height: 140
			    },
			    scale: {
			        startValue: 10,
			        endValue: 150,
			        minorTickInterval: 2,
			        majorTickInterval: 10,
			        showMinorTicks: false,
			    },
			    selectedRange: {
			        startValue: 10,
			        endValue: 150
			    },
				selectedRangeChanged: function (e) {
					$scope.filter.cpu = e;
					$scope.$apply();
				}
			});


			$element.find("#range-5").dxRangeSelector({
			    margin: {
			        top: 20
			    },
			    size: {
			        height: 140
			    },
			    scale: {
			        startValue: 10,
			        endValue: 150,
			        minorTickInterval: 2,
			        majorTickInterval: 10,
			        showMinorTicks: false,
			    },
			    selectedRange: {
			        startValue: 10,
			        endValue: 150
			    },
				selectedRangeChanged: function (e) {
					$scope.filter.cpnu = e;
					$scope.$apply();
				}
			});

			$element.find("#range-6").dxRangeSelector({
			    margin: {
			        top: 20
			    },
			    size: {
			        height: 140
			    },
			    scale: {
			        startValue: 10,
			        endValue: 150,
			        minorTickInterval: 2,
			        majorTickInterval: 10,
			        showMinorTicks: false,
			    },
			    selectedRange: {
			        startValue: 10,
			        endValue: 150
			    },
				selectedRangeChanged: function (e) {
					$scope.filter.cpc = e;
					$scope.$apply();
				}
			});
		}
		$scope.initMultiSelect = function(){
			$scope.multiSelect1 = $element.find("#multi-select1");

			for(var i=0; i<$scope.filter_list.network.length; i++)
				$scope.multiSelect1.append('<option value="'+$scope.filter_list.network[i]+'">'+$scope.filter_list.network[i]+'</option>');

			$scope.multiSelect1.multiSelect({
				afterInit: function()
				{
					// Add alternative scrollbar to list
					this.$selectableContainer.add(this.$selectionContainer).find('.ms-list').perfectScrollbar();
				},
				afterSelect: function(values)
				{
					// Update scrollbar size
					this.$selectableContainer.add(this.$selectionContainer).find('.ms-list').perfectScrollbar('update');
                    $scope.filter.network.push(values[0]);
                    $scope.$apply();
				},
				afterDeselect: function(values){
                    $scope.filter.network = jQuery.grep($scope.filter.network, function(value) {
					  return value != values[0];
					});
                    $scope.$apply();
				}
			});

			$scope.multiSelect2 = $element.find("#multi-select2");

			for(var i=0; i<$scope.filter_list.channel.length; i++)
				$scope.multiSelect2.append('<option value="'+$scope.filter_list.channel[i]+'">'+$scope.filter_list.channel[i]+'</option>');

			$scope.multiSelect2.multiSelect({
				afterInit: function()
				{
					// Add alternative scrollbar to list
					this.$selectableContainer.add(this.$selectionContainer).find('.ms-list').perfectScrollbar();
				},
				afterSelect: function(values)
				{
					// Update scrollbar size
					this.$selectableContainer.add(this.$selectionContainer).find('.ms-list').perfectScrollbar('update');
                    $scope.filter.channel.push(values[0]);
                    $scope.$apply();
				},
				afterDeselect: function(values){
                    $scope.filter.channel = jQuery.grep($scope.filter.channel, function(value) {
					  return value != values[0];
					});
                    $scope.$apply();
				}
			});
		}
		$scope.selectAllNetwork = function() {
			$scope.multiSelect1.multiSelect('select_all');
			$scope.filter.network = $scope.filter_list.network;
		}
		$scope.deSelectAllNetwork = function() {
			$scope.multiSelect1.multiSelect('deselect_all');
			$scope.filter.network = [];
		}
		$scope.selectAllChannel = function() {
			$scope.multiSelect2.multiSelect('select_all');
			$scope.filter.channel = $scope.filter_list.channel;
		}
		$scope.deSelectAllChannel = function() {
			$scope.multiSelect2.multiSelect('deselect_all');
			$scope.filter.channel = [];
		}

		jQuery(document).ready(function($)
		{
			if( ! $.isFunction($.fn.dxChart))
				return;
			$scope.initCharts();
		});

	}).
	controller('AccountPageCtrl', function($scope, $rootScope, $element, $modal){

		$scope.openEditUsernameModal = function()
		{
			var modalInstance = $modal.open({
				templateUrl: 'editUsernameModalContent',
		        controller: 'EditUserInfoModalInstanceCtrl',
				backdrop: true,
		        resolve: {
		          inputs: function () {
		            return {value: $rootScope.currentUser.username};
		          }
		        }
			});

			modalInstance.result.then(function (result) {
		        $rootScope.currentUser.username = result.value;
		    }, function () {
		        console.log('Modal dismissed at: ' + new Date());
		    });
		};

		$scope.openEditEmailModal = function()
		{
			var modalInstance = $modal.open({
				templateUrl: 'editEmailModalContent',
		        controller: 'EditUserInfoModalInstanceCtrl',
				backdrop: true,
		        resolve: {
		          inputs: function () {
		            return {value: $rootScope.currentUser.email};
		          }
		        }
			});

			modalInstance.result.then(function (result) {
		        $rootScope.currentUser.email = result.value;
		    }, function () {
		        console.log('Modal dismissed at: ' + new Date());
		    });
		};

		$scope.openEditPasswordModal = function()
		{
			var modalInstance = $modal.open({
				templateUrl: 'editPasswordModalContent',
		        controller: 'EditUserInfoModalInstanceCtrl',
				backdrop: true,
		        resolve: {
		          inputs: function () {
		            return {value: $rootScope.currentUser.password};
		          }
		        }
			});

			modalInstance.result.then(function (result) {
		        $rootScope.currentUser.password = result.value;
		    }, function () {
		        console.log('Modal dismissed at: ' + new Date());
		    });
		};
	}).
	controller('EditUserInfoModalInstanceCtrl', function ($scope, $modalInstance, inputs) {  
	    $scope.modalInstance = $modalInstance;
	    $scope.value = inputs.value;

	    $scope.save = function() { 
	    	if($("form#form").valid())
	    		$modalInstance.close({value: $scope.value});
	    };
	    $scope.close = function() {
	    	$modalInstance.dismiss('cancel');
	    }
	});