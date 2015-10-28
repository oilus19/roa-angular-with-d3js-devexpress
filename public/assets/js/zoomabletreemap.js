'use strict';
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
/*function getHexFromName(name, strength){
	if(!name)
		return hslToHex(0.5,0.5,0.5);
	var total_amount = 0;
	var random_step_num = 20;
	for (var i = 0; i < name.length; i++) {
		total_amount += name.charCodeAt(i);
	};
	total_amount %= random_step_num;
  //return "#68B828";
  //return "#00B19D";
  return "#ffba00";
	if(strength)
		return hslToHex(total_amount/random_step_num,0.5,0.5);
	return hslToHex(total_amount/random_step_num,0.5,0.5);
}*/
function getHexFromName(parent_value, value,strength){
  parent_value = Math.round(parent_value);
  //if(!name)
  //  return "#68B828";
  var color_palette = [6/6.0, 2/6.0, 3/6.0, 4/6.0, 5/6.0];
  var total_amount = 0;
  var random_step_num = 5;
  
  //return hslToHex((coloring % 16)/16.0,0.5,0.5);
  
  if(strength)
    return hslToHex((parent_value % 16)/16.0,0.5,0.5+(value%20)*0.01);

  return hslToHex((parent_value % 16)/16.0,0.5,0.2+(value%20)*0.01);
}
var original_width = 0;
var transition_element;
function resizeTreemap(element, json_data){
	var margin = {top: 0, right: 0, bottom: 0, left: 0},
	    width = element.width(),
	    height = element.height() - margin.top - margin.bottom,
	    formatNumber = d3.format(",d"),
	    transitioning;

	var x = d3.scale.linear()
	    .domain([transition_element.x, transition_element.x+transition_element.dx])
	    .range([0, width]);
	d3.select("#chart").select("svg")
	    .attr("width", width + margin.left + margin.right)
      .attr("height", height)
	    .style("margin-left", -margin.left + "px")
	    .style("margin-right", -margin.right + "px")
  var svg = d3.select("#chart").selectAll("rect").call(rect);
  d3.select("#chart").selectAll("text").call(text);
  function text(text) {
    text.attr("x", function(d) {if(d) return x(d.x) + 6; return 6;});
    text.attr("y", function(d) {if(d) return y(d.y) + 6; return 6;});
  }
	function rect(rect) {
    rect.attr("x", function(d) {if(d) return x(d.x); return margin.left;})
        .attr("width", function(d) {if(d) return x(d.x + d.dx) - x(d.x); return width;});
    rect.attr("y", function(d) {if(d) return y(d.y); return margin.top;})
        .attr("height", function(d) {if(d) return y(d.y + d.dy) - y(d.y); return height;});
  }

}
var user_type;
function drawBarCharts(json_data){
    var dataSource = [];

    for (var i = 0; i < json_data.children.length; i++) {
      if(json_data.children[i].children)
        for (var j = 0; j < json_data.children[i].children.length; j++){
          dataSource.push({group: json_data.children[i].children[j].name, user: json_data.children[i].children[j][user_type]});
        }
      else  
        dataSource.push({group: json_data.children[i].name, user: json_data.children[i][user_type]});

    };
    dataSource.sort(function(a, b) {
          return a.user-b.user;  
        });
      var pane_height = 450;
      if(dataSource.length>15)
        pane_height=30*dataSource.length;
      $('#bar-5').height(pane_height);

      $("#bar-5").dxChart({
        rotated: true,
        pointSelectionMode: "multiple",
        dataSource: dataSource,
        height: 1000,
        commonSeriesSettings: {
          type: "stackedbar",
          selectionStyle: {
            hatching: {
              direction: "left"
            }
          },
          label: {
            visible: true,
            backgroundColor: 'none',
            format: "fixedPoint",                     
            precision: 0  
          },
          minBarSize: 18
        },
        series: [
          { argumentField: "group",  valueField: "user", name: user_type, color: "#ffd700" },
        ],
        adjustOnZoom: true,
        legend: {
          verticalAlignment: "bottom",
          horizontalAlignment: "center"
        },
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                return {
                    text: arg.seriesName + ": " + arg.valueText
                };
            }
        },
        pointClick: function(point) {
          point.isSelected() ? point.clearSelection() : point.select();
        }
      });
      var chartTest = $('#bar-5').dxChart('instance');
      chartTest.option({ size: { heigth: pane_height } });
  }
var costBudget = 0;
var previousCostBudget = 0;
var $compile = 0;
var $scope = 0;
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function refreshScreen(data){
  //var costPerConnectionCounterHtml = $('<label xe-counter data-count="this" data-from="'+previousCostBudget+'" data-to="'+costBudget+'" data-prefix="Budget: $" data-duration="1">Budget: $'+previousCostBudget+'</label>');
   if(Math.round(data["value"])>1000000)
      $('.budget-of-selected').html("Budget: $"+numberWithCommas(Math.round(data["value"]/100000)/10)+"M");
    else if(Math.round(data["value"])>1000)
      $('.budget-of-selected').html("Budget: $"+numberWithCommas(Math.round(data["value"]/100)/10)+"K");
    else
      $('.budget-of-selected').html("Budget: $"+numberWithCommas(Math.round(data["value"])));

  $('.users-of-selected').html(numberWithCommas(data[user_type]));
  $('.cpu-of-selected').html("$"+numberWithCommas(Math.round(data["cpu"])));
  $('.revenue-of-selected').html("$"+numberWithCommas(data["revenue"]));

}
function drawZoomablTreemap(element, json_data, usertype, compile, scope){
  $compile = compile;
  $scope = scope;
  user_type = usertype;
  refreshScreen(json_data);
	var margin = {top: 50, right: 0, bottom: 0, left: 0},
	    width = element.width(),
	    height = element.height() - margin.top - margin.bottom,
	    formatNumber = d3.format(",d"),
	    transitioning;

	original_width = width;

	var x = d3.scale.linear()
	    .domain([0, width])
	    .range([0, width]);

	var y = d3.scale.linear()
	    .domain([0, height])
	    .range([0, height]);

	var treemap = d3.layout.treemap()
	    .children(function(d, depth) { return depth ? null : d._children; })
	    .sort(function(a, b) { return a.value - b.value; })
	    .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
	    .round(false);
	d3.select("#chart").select("svg")
       .remove();
	var svg = d3.select("#chart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.bottom + margin.top)
	    .style("margin-left", -margin.left + "px")
	    .style("margin.right", -margin.right + "px")
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	    .style("shape-rendering", "crispEdges");

	var grandparent = svg.append("g")
	    .attr("class", "grandparent");

	grandparent.append("rect")
	    .attr("y", -margin.top)
	    .attr("width", width)
	    .attr("height", margin.top);

	grandparent.append("text")
	    .attr("x", 30)
	    .attr("y", 20 - margin.top)
	    .attr("dy", ".75em");
	    
	  initialize(json_data);

	  accumulate(json_data);

	  layout(json_data);
    var tooltip = d3.select("#chart")                               // NEW
          .append('div')                                                // NEW
          .attr('class', 'treemaptooltip');                                    // NEW
                      
        /*tooltip.append('div')                                           // NEW
          .attr('class', 'label');                                      // NEW
             
        tooltip.append('div')                                           // NEW
          .attr('class', 'count');                                      // NEW
        tooltip.append('div')                                           // NEW
          .attr('class', 'percent');                                    // NEW*/
	  display(json_data, tooltip);
	  transition_element =json_data;
      
	function initialize(root) {
    	root.x = root.y = 0;
    	root.dx = width;
    	root.dy = height;
    	root.depth = 0;
	  }

	 function layout(d) {
	    	
	    if (d._children) {
	      treemap.nodes({_children: d._children});
	      d._children.forEach(function(c) {
	        c.x = d.x + c.x * d.dx;
	        c.y = d.y + c.y * d.dy;
	        c.dx *= d.dx;
	        c.dy *= d.dy;
	        c.parent = d;
	        c.children = c._children;
	        layout(c);
	      });
	    }
	  }
	  function display(d) {
      var tooltip = d3.select(".treemaptooltip");
    grandparent
        .datum(d.parent)
        .on("click", transition)
      .select("text")
        .text(name(d));

    var g1 = svg.insert("g", ".grandparent")
        .datum(d)
        .attr("class", "depth");

    var g = g1.selectAll("g")
        .data(d._children)
      .enter().append("g");

    g.filter(function(d) { return d._children; })
        .classed("children", true)
        .on("click", transition);

      function map_onmousemove(d){
          "use strict";
          var coordinates = d3.mouse(this);
          var x = coordinates[0];
          var y = coordinates[1];
          tooltip.style("left", (x+20)+"px");
          tooltip.style("top", (y+50)+"px");
          tooltip.style("background-color", function() {
              if(!d["parent"]["parent"])
                  return getHexFromName(d.color_tag, "", false);
              return getHexFromName(d["parent"].color_tag, Math.round(d.value), false);

          }).style("position", "absolute");

          var cp_name = "cpc";
          var cp_display_name = "CpC";
          if (user_type == "users")
          {
              cp_name = "cpu";
              cp_display_name = "cpu"
          }
          else if(user_type == "new_users")
          {
              cp_name = "cpnu";
              cp_display_name = "CpNU";
          }

          var dd_parent;
          if(!d["parent"]["parent"]) {
              dd_parent = d.parent;
          } else {
              dd_parent = d.parent.parent;
          }
          var pieces = [
              d["name"],
              "<br>", numberWithCommas(d[user_type]), " | ", Math.round(d[user_type]/dd_parent[user_type]*100), "% of total ", user_type,
              "<br>$", numberWithCommas(Math.round(d.budget)), " | ", Math.round(d.budget/dd_parent.budget*100), "% of total budget",
              "<br>$", numberWithCommas(Math.round(d[cp_name])), " | ", Math.abs(Math.round(d[cp_name]/dd_parent[cp_name]*100)-100),
              "% ", (d[cp_name]-dd_parent[cp_name]>0 ? "higher":"lower"), " of avg ", cp_display_name
          ];
          tooltip.html(pieces.join(''));
          tooltip.style('display', 'block');
          tooltip.style('z-index', '1000');
      }

    g.selectAll(".child")
        .data(function(d) { return d._children || [d]; })
        .enter().append("rect")
        .attr("class", "child")
        .call(rect)
        .on('mousemove', map_onmousemove)
        .on('mouseout', function(d) {          
            tooltip.style('display', 'none');                           // NEW
          });      

    g.append("rect")
        .attr("class", "parent")
        .call(rect)
        .on('mousemove', map_onmousemove)
        .on('mouseout', function(d) {          
            tooltip.style('display', 'none');                           // NEW
          })
      .append("title")
        .text(function(d) { return formatNumber(d.value); });

    g.append("text")
        .attr("dy", ".75em")
        .text(function(d) { return d.name; })
        .call(text);

    function transition(d) {
      
      if (transitioning || !d) return;

      refreshScreen(d);
      transitioning = true;

      var g2 = display(d),
          t1 = g1.transition().duration(750),
          t2 = g2.transition().duration(750);

      // Update the domain only after entering new elements.
      transition_element = d;
      x.domain([d.x, d.x + d.dx]).range([0,element.width()]);
      y.domain([d.y, d.y + d.dy]);
      drawBarCharts(d);   
      // Enable anti-aliasing during the transition.
      svg.style("shape-rendering", null);

      // Draw child nodes on top of parent nodes.
      svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

      // Fade-in entering text.
      g2.selectAll("text").style("fill-opacity", 0);

      // Transition to the new view.
      t1.selectAll("text").call(text).style("fill-opacity", 0);
      t2.selectAll("text").call(text).style("fill-opacity", 1);
      t1.selectAll("rect").call(rect);
      t2.selectAll("rect").call(rect);

      // Remove the old node when the transition is finished.
      t1.remove().each("end", function() {
        svg.style("shape-rendering", "crispEdges");
        transitioning = false;
      });

    }

    return g;
  }


    // Aggregate the values for internal nodes. This is normally done by the
  // treemap layout, but not here because of our custom implementation.
  // We also take a snapshot of the original children (_children) to avoid
  // the children being overwritten when when layout is computed.
  function accumulate(d) {
    return (d._children = d.children)
        ? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
        : d.value;
  }

  // Compute the treemap layout recursively such that each group of siblings
  // uses the same size (1×1) rather than the dimensions of the parent cell.
  // This optimizes the layout for the current zoom state. Note that a wrapper
  // object is created for the parent node for each group of siblings so that
  // the parent’s dimensions are not discarded as we recurse. Since each group
  // of sibling was laid out in 1×1, we must rescale to fit using absolute
  // coordinates. This lets us use a viewport to zoom.


  

  function text(text) {
    text.attr("x", function(d) { return x(d.x) + 6; })
        .attr("y", function(d) { return y(d.y) + 6; });
  }

  function rect(rect) {
    rect.attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y); })
        .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
        .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
       	.style("fill", function(d) {
       		if(!d["parent"]["parent"])
       			return getHexFromName(d.color_tag, "", true);
       		return getHexFromName(d["parent"].color_tag, d.value, true);
    		
		});
  }

  function name(d) {
    return d.name;
  }
	//});
}



