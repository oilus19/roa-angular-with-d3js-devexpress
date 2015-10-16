'use strict';

angular.module('resultsonair.controllers').
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
	});