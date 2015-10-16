'use strict';

angular.module('resultsonair.controllers').
	controller('BreakdownPageCtrl', function($scope, $rootScope, $element){
		$rootScope.page_title = "Breakdown";
		$rootScope.exportTableSelector = '#breakdown_table';
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

	});