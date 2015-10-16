'use strict';

angular.module('resultsonair.controllers').
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
	});