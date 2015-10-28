'use strict';

angular.module('resultsonair.controllers').
	controller('RoiPageCtrl', function($scope, $rootScope, $window, $compile){
		$rootScope.page_title = "ROI";
		$scope.cache = {};
		$scope.filter1 = 'network';
		$scope.filter2 = 'weekday';
		$scope.filter3 = "users";

		var w = angular.element($window);

		w.bind('resize', function () {
			var element = $("#chart");
			resizeTreemap(element, $scope.dataset);
			//drawZoomablTreemap(element, $scope.dataset);
		});
		$scope.LoadData = function()
		{
			var data = {
				'start_date': '2015-07-01',
				'end_date': '2015-08-20',
				'campaign_id': '2',
				"dim_main" : $scope.filter1,
				"dim_opt" : $scope.filter2
			};
			var element = $("#chart");
			var DATA_URL = 'http://roa-rest-dev.elasticbeanstalk.com/roi_info';

			data_from_api({
				type: 'GET',
				data: data,
				url: DATA_URL
			}).then(function(res){
				res.data.children.map(function(item, index){
					item['color_tag'] = index;
					return index;
				});
				$scope.dataset = res.data;
				drawZoomablTreemap(element, res.data, $scope.filter3, $compile, $scope);
				drawBarCharts(res.data);
			});
		};

		function data_from_api(object){
			var key = JSON.stringify(object);
			var dfd = $.Deferred();
			var main_dfd = $.Deferred();
			if(!$scope.cache[key]) {
				dfd = $.ajax(object);
			} else {
				dfd.resolve($scope.cache[key])
			}
			dfd.then(function(res){
				$scope.cache[key] = res;
				main_dfd.resolve($scope.cache[key]);
			});
			return main_dfd.promise();
		}

		$scope.$watch(function(scope){return scope.filter3}, function(){
			$scope.LoadData();
		});

		$scope.LoadData();
	});