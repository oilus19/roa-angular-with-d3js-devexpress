'use strict';

angular.module('resultsonair.controllers').
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
	});