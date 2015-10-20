'use strict';

angular.module('resultsonair.controllers').
	controller('TrendsPageCtrl', function($scope, $element, $rootScope, $compile){
		$rootScope.page_title = "Trends";
		$rootScope.exportTableSelector = '#trend_table';

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
					u = 30;
					start = 15;
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
			$compile($element.find('.users-counter').html(usersCounterHtml))($scope);
			var newUsersCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.new_users+'" data-decimal="," data-duration="1.5">'+$scope.new_users+'</label>');
			$compile($element.find('.newusers-counter').html(newUsersCounterHtml))($scope);
			var conversionCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.conversion+'" data-decimal="," data-duration="1.5">'+$scope.conversion+'</label>');
			$compile($element.find('.conversion-counter').html(conversionCounterHtml))($scope);
			var cpuCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.cpu+'" data-decimal="," data-duration="1.5">'+$scope.cpu+'</label>');
			$compile($element.find('.cpu-counter').html(cpuCounterHtml))($scope);
			var cpnuCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.cpnu+'" data-decimal="," data-duration="1.5">'+$scope.cpnu+'</label>');
			$compile($element.find('.cpnu-counter').html(cpnuCounterHtml))($scope);
			var cpcCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.cpc+'" data-decimal="," data-duration="1.5">'+$scope.cpc+'</label>');
			$compile($element.find('.cpc-counter').html(cpcCounterHtml))($scope);
			var budgetCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.budget+'" data-decimal="," data-prefix="$" data-duration="1.5">$'+$scope.budget+'</label>');
			$compile($element.find('.budget-counter').html(budgetCounterHtml))($scope);
			var adsCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.ads+'" data-decimal="," data-duration="1.5">'+$scope.ads+'</label>');
			$compile($element.find('.ads-counter').html(adsCounterHtml))($scope);
			var revenueCounterHtml = $('<label xe-counter data-count="this" data-from="0" data-to="'+$scope.revenue+'" data-decimal="," data-prefix="$" data-duration="1.5">$'+$scope.revenue+'</label>');
			$compile($element.find('.revenue-counter').html(revenueCounterHtml))($scope);
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
							sliderMarker: {
								customizeText: function (value) {
					                return moment(value.value).format('MMM DD');
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
							sliderMarker: {
								customizeText: function (value) {
					                return moment(value.value).format('MMM DD');
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
							sliderMarker: {
								customizeText: function (value) {
					                return moment(value.value).format('MMM DD');
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
							sliderMarker: {
								customizeText: function (value) {
					                return moment(value.value).format('MMM DD, [Week] W');
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
							sliderMarker: {
								customizeText: function (value) {
					                return moment(value.value).format('MMM DD, [Week] W');
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
							sliderMarker: {
								customizeText: function (value) {
					                return moment(value.value).format('MMM DD, [Week] W');
					            }
							},
            			});
            			break;
            		case "Month":
            			$scope.lineChart1.option({
            				dataSource: $scope.getDataSourceFor($scope.dataSource1, 'Month'),
            				scale: {
								minorTickInterval: "month",
								majorTickInterval: {
									months: 1
								}
							},
							sliderMarker: {
								customizeText: function (value) {
					                return moment(value.value).format('MMM');
					            }
							},
            			});
            			$scope.lineChart2.option({
            				dataSource: $scope.getDataSourceFor($scope.dataSource2, 'Month'),
            				scale: {
								minorTickInterval: "month",
								majorTickInterval: {
									months: 1
								}
							},
							sliderMarker: {
								customizeText: function (value) {
					                return moment(value.value).format('MMM');
					            }
							},
            			});
            			$scope.lineChart3.option({
            				dataSource: $scope.getDataSourceFor($scope.dataSource3, 'Month'),
            				scale: {
								minorTickInterval: "month",
								majorTickInterval: {
									months: 1
								}
							},
							sliderMarker: {
								customizeText: function (value) {
					                return moment(value.value).format('MMM');
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
							sliderMarker: {
								customizeText: function (value) {
					                return moment(value.value).format('hh:mm a, MMM DD');
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
							sliderMarker: {
								customizeText: function (value) {
					                return moment(value.value).format('hh:mm a, MMM DD');
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
							sliderMarker: {
								customizeText: function (value) {
					                return moment(value.value).format('hh:mm a, MMM DD');
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
	});