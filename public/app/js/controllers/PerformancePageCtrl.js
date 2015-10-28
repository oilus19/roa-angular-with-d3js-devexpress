'use strict';

angular.module('resultsonair.controllers').
	controller('PerformancePageCtrl', function($scope, $rootScope, $element){
		$rootScope.page_title = "Performance";
		$rootScope.exportTableSelector = '#result_table.performance-table';

		$scope.performanceChart = {};
		$scope.filter1 = 'network';
		$scope.filterv = true;
		$scope.records = [];
		$scope.total = {};
		$scope.cache = {};

		$scope.ads = 0;
		$scope.palette = [];
		$scope.data = [];
		$scope.filter3 = "users";
		$scope.series = [];

		$scope.LoadData = function()
		{
			var cost_name = "";
			switch($scope.filter3)
			{
			case "users":
				cost_name = "cpu";
				break;
			case "new_users":
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
			$scope["new_users"] = 0;
			$scope["conversions"] = 0;
			$scope.records = [];
			$scope.series = [];
			$scope.palette = [];
			$scope.dataSource = [];

			function update_color(item, index) {
				var color = hslToHex(Math.random(),0.5, 0.5);
				$scope.palette.push(color);
				$scope.series.push({
					argumentField: 'responses_'+index,
					valueField: 'cost_'+index,
					sizeField: 'ads_'+index,
					tagField: 'name',
					color: color
				});
			}

			// TODO change start_date and end_date
			var data = {
				'start_date': '2015-07-01',
				'end_date': '2015-08-20',
				'campaign_id': '2',
				"dim_main" : $scope.filter1,
				"dim_opt" : $scope.filter2
			};

			var DATA_URL = 'http://localhost:3000/performance_info';

			data_from_api({
				type: 'GET',
				data: data,
				url: DATA_URL
			}).then(function(data){
				$scope.data = data.performance_items;
				$scope.records = data.performance_items;
				$scope.total = data.performance_total;
				$scope.data_keys = {};
				data.performance_items.map(function(item, index){
					$scope.data_keys[item['name']] = index;
				});

				$scope.dataSource = data.performance_items.map(function(item, index){
					// TODO fix
					item["cost"+"_"+index] = Math.round(item[cost_name]);
					item["responses"+"_"+index] = Math.round(item[$scope.filter3]/100)/10;
					item["ads"+"_"+index] = item['ads'];
					item["maininfo"] = "sdf";
					// TODO refactor
					return item;
				});
				data.performance_items.map(update_color);

				// TODO refactor
				$scope.CpU = $scope.total["cpu"];
				$scope.CpNU = $scope.total["cpnu"];
				$scope.CpC = $scope.total["cpc"];

				$scope["users"] = Number($scope.total["users"]);
				$scope["new_users"] = Number($scope.total["new_users"]);
				$scope["conversions"] = Number($scope.total["conversions"]);
				$scope.ads = $scope.total["ads"];
				$scope.roi = $scope.total["roi"];

				$scope.$apply();
				$scope.updateChart();
				$scope.updateTable();
				$scope.updateCounters();
				$scope.updateTotal();
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
		        };

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
					visible: false
				},
				palette: $scope.palette,
				onPointHoverChanged: function (info) {
					var clickedPoint = info.target;
					var item = $scope.records[$scope.data_keys[clickedPoint.tag]];

					if (clickedPoint.isHovered()) {
			            $("#cpu_num").html("$"+Math.round(item["cpu"]));
						$("#cpnu_num").html("$"+Math.round(item["cpnu"]));
						$("#cpc_num").html("$"+Math.round(item["cpc"]));
			        } else {
			            $("#cpu_num").html("$"+Math.round($scope.CpU));
			            $("#cpnu_num").html("$"+Math.round($scope.CpNU));
			            $("#cpc_num").html("$"+Math.round($scope.CpC));
			        }
			    },
		        onPointClick: function (info) {
		            var clickedPoint = info.target;
		            clickedPoint.isSelected() ? clickedPoint.clearSelection() : clickedPoint.select();
		        },
		        onPointSelectionChanged: function (info) {
		            var selectedPoint = info.target;
		            
		            if (selectedPoint.isSelected()) {
						$element.find("#result_table tr").removeClass('selected');
					    $element.find("#result_table tr[title='"+selectedPoint.tag+"']").addClass('selected');
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
			    zoomingMode: "all"
			}).dxChart("instance");
		};
		$scope.updateCounters = function() {
            $("#cpu_num").html("$"+Math.round($scope.CpU));
            $("#cpnu_num").html("$"+Math.round($scope.CpNU));
            $("#cpc_num").html("$"+Math.round($scope.CpC));
		};
		$scope.updateTotal = function(){
			var tr = $("<tr class='total'><th colspan='1' id='result_table-col-0-clone'></th><th data-priority='1' id='result_table-col-1-clone'></th><th data-priority='2' id='result_table-col-2-clone'></th><th data-priority='7' id='result_table-col-3-clone'></th><th data-priority='4' id='result_table-col-4-clone'></th><th data-priority='5' id='result_table-col-5-clone'></th><th data-priority='7' id='result_table-col-6-clone'></th><th data-priority='7' id='result_table-col-7-clone'></th></tr>");
			$(tr).addClass('bg-info');
			for(var i=1; i<=$element.find("#result_table-clone thead tr:last-child th").length; i++) {
				$element.find("#result_table thead tr:last-child th:nth-child("+i+")").is(":visible")?tr.find("th:nth-child("+i+")").css('display','table-cell'):tr.find("th:nth-child("+i+")").css('display','none');
			}	

			$(tr).find('th:nth-child(1)').html('Total');
			$(tr).find('th:nth-child(2)').html($scope.total.ads);
			$(tr).find('th:nth-child(3)').html($scope.total.budget);
			$(tr).find('th:nth-child(4)').html($scope.total.roi);
			$(tr).find('th:nth-child(5)').html($scope.total.revenue);
			$(tr).find('th:nth-child(6)').html($scope.total.users);
			$(tr).find('th:nth-child(7)').html($scope.total.new_users);
			$(tr).find('th:nth-child(8)').html($scope.total.conversions);
			
			$element.find('#result_table-clone thead tr.total').remove();
			$element.find('#result_table thead tr.total').remove();
			$element.find('#result_table-clone thead').prepend(tr);
			$element.find('#result_table thead').prepend(tr.clone());
		};
		$scope.updateTable = function() {
			var table = $element.find("#result_table");
			var table_clone = $element.find("#result_table-clone");
			var tr = $("<tr><td colspan='1' data-columns='result_table-col-0'></td><td data-priority='1' data-columns='result_table-col-1'></td><td data-priority='2' data-columns='result_table-col-2'></td><td data-priority='7' data-columns='result_table-col-3'></td><td data-priority='4' data-columns='result_table-col-4'></td><td data-priority='5' data-columns='result_table-col-5'></td><td data-priority='7' data-columns='result_table-col-6'></td><td data-priority='7' data-columns='result_table-col-7'></td></tr>");
					
			for(var i=1; i<=$(table).find("thead tr th").length; i++) {
				$(table).find("thead tr th:nth-child("+i+")").is(":visible")?tr.find("td:nth-child("+i+")").css('display','table-cell'):tr.find("td:nth-child("+i+")").css('display','none');
			}	
			$(table).DataTable().clear();
			$(table_clone).DataTable().clear();
			var column_list = ['name','ads','budget','roi','revenue','users','new_users','conversions'];
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
		};
		$scope.updateChart = function(){
			$scope.performanceChart.option({
				dataSource: $scope.dataSource,
				palette: $scope.palette,
				series: $scope.series
			});
		};

		$scope.$watch(function(scope){return scope.filter3},function(){
			$scope.LoadData();

			var argumentTitle, valueTitle, shortArgumentTitle;

			switch($scope.filter3) {
				case 'users':
					argumentTitle = "Users";
					valueTitle = "Avg Cost per User";
					shortArgumentTitle = "CpU";
					break;
				case 'new_users':
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
				}
			});

		});

		jQuery(document).ready(function(){
			$scope.initChart();
		});
	});