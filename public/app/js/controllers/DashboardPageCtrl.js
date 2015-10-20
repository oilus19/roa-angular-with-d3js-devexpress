'use strict';

angular.module('resultsonair.controllers').
	controller('DashboardPageCtrl', function($scope, $rootScope, $sce, $compile, $element){
		$rootScope.page_title = "Dashboard";

		$scope.url = 'http://roa-rest-prod.elasticbeanstalk.com/dashboard_info';
		$scope.campaign_id = 12;
		$scope.start_date = "2015-07-10";
		$scope.end_date = "2015-08-10";

	    $scope.loadPage = function(){
	    	var request_url = $scope.url+"?campaign_id=" + $scope.campaign_id + "&start_date=" + $scope.start_date + "&end_date=" + $scope.end_date;
	    	console.log(request_url);
	    	$.getJSON(request_url, function(res) {
		    	$scope.dataset = res.data;
		    	$scope.revenueFromTV = res.revenue;
		    	$scope.returnOnInvestment = Math.floor(res.avg_roi*100)/100;
		    	$scope.costPerConversion = Math.floor(res.avg_cpc*100)/100;
		    	$scope.daily_revenue_list = res.daily_revenue;
		    	$scope.first_day = $scope.daily_revenue_list[0]["date"];
		    	$scope.initCounters();
		    	$scope.initBarChart();
		    	$scope.initRoiGraph();
	    	});
	    }

	    $scope.dateRangeChanged = function(start_date, end_date){
	    	console.log(start_date);
	    	$scope.start_date = start_date;
	    	$scope.end_date = end_date;
	    	$scope.loadPage();
	    }

	    $scope.loadPage();

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

			for(i=0; i<$scope.daily_revenue_list.length; i++)
			{
				if($scope.daily_revenue_list[i])
					data_source.push({day: $scope.daily_revenue_list[i]["date"], revenue: Number($scope.daily_revenue_list[i]["revenue"])});
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
						customizeText: function (arg) {
							var date_current = new Date(arg.value);
							var date_base = new Date($scope.first_day);
							var date_diff = Math.round((date_current-date_base)/(1000*60*60*24));
							if(date_diff % 2 == 0)
								return moment(date_current).format("MMMM D");
							else
								return null;
						}
					}
				},
				tooltip: {
			        enabled: true,
			        location: "edge",
			        customizeTooltip: function (arg) {
			        	var date = new Date(arg.argument);

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
	});