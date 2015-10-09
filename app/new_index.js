var XLSX = require('xlsx');
var workbook = XLSX.readFile('app/assets/xlsx/new_data.xlsx');
var trendsworkbook = XLSX.readFile('app/assets/xlsx/trends-table.xlsx');

exports.performance_dataset = function(req, res){
    var tab_name = req.body.tab_name;
    var combine_name = req.body.combine_name;
    var user_type_array = req.body.user_type_array;
    var response_type = req.body.response_type;
    var result = null;
    var temp_object = {};
    if(!tab_name)
    {
        res.json(result);
        return;
    }
    workbook.SheetNames.forEach(function(sheetName) {
        if (result != null)
            return;
        result = {};
        var json_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        for (var i = 0; i < json_data.length; i++) {
            
            if(!result[json_data[i][tab_name]])
                result[json_data[i][tab_name]] = {};
            if(combine_name){
                if(!result[json_data[i][tab_name]][json_data[i][combine_name]])
                    result[json_data[i][tab_name]][json_data[i][combine_name]] = {};
                temp_object = result[json_data[i][tab_name]][json_data[i][combine_name]];
            }else{
                if(!result[json_data[i][tab_name]])
                    result[json_data[i][tab_name]] = {};
                temp_object = result[json_data[i][tab_name]];
            }
            
                if(temp_object["length"] == undefined)
                {
                    temp_object["length"] = 0;
                    temp_object["tvr"] = 0;
                    temp_object["impacts"] = 0;
                    temp_object["cost"] = 0;
                    //temp_object["cpt"] = 0;
                    temp_object["Sessions"] = 0;
                    temp_object["goal1"] = 0;
                    temp_object["goal2"] = 0;
                    temp_object["goal3Completions"] = 0;
                    temp_object["Bounces"] = 0;
                    //temp_object["avgsessionduration"] = 0;
                    temp_object["cpu"] = 0;
                    temp_object["cpnu"] = 0;
                    temp_object["cpc"] = 0;
                    temp_object["cpc1"] = 0;
                    temp_object["cpc2"] = 0;
                    temp_object["cpc3"] = 0;
                    temp_object["revenue"] = 0;
                    temp_object["bouncepercent"] = 0;
                    temp_object["roi"] = 0;
                    temp_object["ads"] = 0;
                    temp_object["new users"] = 0;
                    temp_object["users"] = 0;
                    temp_object["conversions"] = 0;
                }
                temp_object["length"] += Number(json_data[i]["length"]) || 0;
                temp_object["tvr"] += Number(json_data[i]["tvr"]) || 0;
                temp_object["impacts"] += Number(json_data[i]["impacts"]) || 0;
                cost = (json_data[i]["Sum of cost"] || "");
                temp_object["cost"] += Number(cost.replace(",",".")) || 0;
                //temp_object["cpt"] += Number(json_data[i]['cpt']);
                temp_object["Sessions"] += Number(json_data[i]["Sessions"]) || 0;
                temp_object["goal1"] += Number(json_data[i]["goal1"]) || 0;
                temp_object["goal2"] += Number(json_data[i]["goal2"]) || 0;
                temp_object["goal3Completions"] += Number(json_data[i]["goal3Completions"]) || 0;
                temp_object["Bounces"] += Number(json_data[i]["Bounces"]) || 0;
                //temp_object["avgsessionduration"] += Number(json_data[i]["avgsessionduration"]);
                temp_object["cpu"] += Number(json_data[i]["cpu"])*Number(json_data[i]["users"]) || 0;
                temp_object["cpnu"] += Number(json_data[i]["cpnu"])*Number(json_data[i]["new users"])|| 0;
                temp_object["cpc1"] += Number(json_data[i]["cpc1"])|| 0;
                temp_object["cpc2"] += Number(json_data[i]["cpc2"])|| 0;
                temp_object["cpc3"] += Number(json_data[i]["cpc3"]) || 0;
                temp_object["cpc"] += Number(json_data[i]["cpc"])*Number(json_data[i]["conversions"]) || 0;
                temp_object["revenue"] += Number(json_data[i]["revenue"]) || 0;
                temp_object["bouncepercent"] += Number(json_data[i]["bouncepercent"]) || 0;
                temp_object["roi"] += Number(json_data[i]["roi"]) || 0;
                temp_object["new users"]+= Number(json_data[i]["new users"]) || 0;
                temp_object["users"] += Number(json_data[i]["users"]) || 0;
                temp_object["conversions"] += Number(json_data[i]["conversions"]) || 0;
                temp_object["ads"] ++;
            
        };
        res.json(result);
    });
    
    //result : JSON.stringify(result)
}


exports.planner_dataset = function(req, res){

    var result = null;
    var temp_object = {};

    workbook.SheetNames.forEach(function(sheetName) {
        if (result != null)
            return;
        result = [];
        var json_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        var limit = 100;
        var sum_budget=0;
        var sum_impression=0;
        var network_list = [];
        for (var i = 0; i < json_data.length; i+=10) {
            if(json_data[i]['networks'])
            {
                result.push(json_data[i]);
                if(network_list.indexOf(json_data[i]["networks"]) == -1)
                    network_list.push(json_data[i]["networks"]);
                cost = (json_data[i]["Sum of cost"] || "");
                sum_budget += Number(cost.replace(",",".")) || 0;
                sum_impression += Number(json_data[i]["impacts"]) || 0;
                limit--;
            }
        }
        res.json({"sum_budget" : sum_budget, "sum_impression" : sum_impression, "network_list" : network_list, "data" : result});
    });
}

exports.dashboard_dataset = function(req, res){
    var result = null;
    var temp_object = {};


    workbook.SheetNames.forEach(function(sheetName) {
        if (result != null)
            return;
        result = [];
        var json_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        var limit = 1000;
        var keep_limit = limit;
        var revenue=0;
        var avg_roi=0;
        var avg_cpc=0;
        var daily_revenue_list = new Array(31);
        var accumulated_revenue_list = new Array(31);

        for (var i = 0; i < json_data.length; i++) {
            //if (limit == 0)
            //        break;
            if(json_data[i]['networks'])    
            {
                var date = Math.round(Number(json_data[i]["datetime"].split("/")[1]))-1;

                result.push(json_data[i]);
                revenue += Number(json_data[i]["Sum of cost"]) || 0;
                if(!daily_revenue_list[date])
                    daily_revenue_list[date] = 0;
                daily_revenue_list[date] += Number(json_data[i]["Sum of cost"]) || 0;
                avg_roi += Number(json_data[i]["roi"]) || 0;
                avg_cpc += Number(json_data[i]["cpc"]) || 0;
                limit--;
            }
        }
        avg_roi /= keep_limit;
        avg_cpc /= keep_limit;
        var date_num = 0;
        var daily_revenue_sum = 0;
        var max_revenue = 0;
        //accumulated_revenue_list[0] = daily_revenue_list[i] || 0;

        for(var i = 0; i< 31; i++){
            if(daily_revenue_list[i]>max_revenue)
                max_revenue = daily_revenue_list[i];
            daily_revenue_sum += daily_revenue_list[i] || 0;
            accumulated_revenue_list[i] = Math.round(daily_revenue_sum/(i+1));
        }

        res.json({"revenue" : revenue, "avg_roi" : avg_roi, "avg_cpc" : avg_cpc, "data" : result, "daily_revenue_list" : daily_revenue_list,
        "accumulated_revenue_list" : accumulated_revenue_list, "max_revenue" : max_revenue});
    });
}

exports.roi_dataset = function(req, res){
    var tab_name = req.body.tab_name;
    var combine_name = req.body.combine_name;
    var user_type_array = req.body.user_type_array;
    var result = {"name" : "Cost", "children" : [], "value" : 0, "ads" : 0, "cpc" : 0, "cpu" : 0, "cpnu" : 0, "revenue" : 0,
        "users": 0, "new users": 0, "conversions": 0};
    var first_sheet = false;
    var temp_object = {};
    if(!tab_name)
    {
        res.json(result);
        return;
    }
    workbook.SheetNames.forEach(function(sheetName) {
        if (first_sheet)
            return;
        var json_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        var color_tag = 0;
        console.log(tab_name);
        for (var i = 0; i < json_data.length; i++) {
            var x_index = -1, y_index = -1;
            for(var x = 0; x < result["children"].length; x++){
                if (result["children"][x]["name"] == json_data[i][tab_name])
                {
                    x_index = x;
                    break;
                }
            }
            if(x_index == -1)
            {
                result["children"].push({"name":json_data[i][tab_name]});
                x_index = result["children"].length-1;
                if(combine_name)
                    result["children"][x_index]["children"] = [];
            }
            if(x_index != -1 && combine_name)
            {
                for(var y = 0; y < result["children"][x_index]["children"].length; y++){
                    if (result["children"][x_index]["children"][y]["name"] == json_data[i][combine_name])
                    {
                        y_index = y;
                        break;
                    }
                }
                if(y_index == -1)
                {
                    result["children"][x_index]["children"].push({"name":json_data[i][combine_name]});
                    y_index = result["children"][x_index]["children"].length-1;
                }
            }
            //result["children"].push({"name" : ""})
            if(combine_name){
                temp_object = result["children"][x_index]["children"][y_index];
                temp_object_parent = result["children"][x_index];
            }else{
                temp_object = result["children"][x_index];
                temp_object_parent = {};
            }
                if(temp_object["value"] == undefined)   temp_object["value"] = 0;
                if(temp_object["cpu"] == undefined) temp_object["cpu"] = 0;
                if(temp_object["cpc"] == undefined) temp_object["cpc"] = 0;
                if(temp_object["cpnu"] == undefined) temp_object["cpnu"] = 0;
                if(temp_object["ads"] == undefined) temp_object["ads"] = 0;
                if(temp_object["revenue"] == undefined) temp_object["revenue"] = 0;
                if(temp_object["users"] == undefined) temp_object["users"] = 0;
                if(temp_object["new users"] == undefined) temp_object["new users"] = 0;
                if(temp_object["conversions"] == undefined) temp_object["conversions"] = 0;
                if(temp_object_parent["ads"] == undefined)  temp_object_parent["ads"] = 0;
                if(temp_object_parent["revenue"] == undefined)  temp_object_parent["revenue"] = 0;
                if(temp_object_parent["cpu"] == undefined)  temp_object_parent["cpu"] = 0;
                if(temp_object_parent["cpnu"] == undefined)  temp_object_parent["cpnu"] = 0;
                if(temp_object_parent["cpc"] == undefined)  temp_object_parent["cpc"] = 0;
                if(temp_object_parent["value"] == undefined)    temp_object_parent["value"] = 0;
                if(temp_object_parent["users"] == undefined) temp_object_parent["users"] = 0;
                if(temp_object_parent["new users"] == undefined) temp_object_parent["new users"] = 0;
                if(temp_object_parent["conversions"] == undefined) temp_object_parent["conversions"] = 0;
                if(result["children"][x_index]["color_tag"] == undefined){
                    result["children"][x_index]["color_tag"] = color_tag;
                    color_tag += 3;
                }
                cost = (json_data[i]["Sum of cost"] || "");
                temp_object["value"] += Number(cost.replace(",",".")) || 0;
                temp_object["ads"] ++;
                temp_object["cpu"] += Number(json_data[i]["cpu"])*Number(json_data[i]["users"]) || 0;
                temp_object["cpnu"] += Number(json_data[i]["cpnu"])*Number(json_data[i]["new users"]) || 0;
                temp_object["cpc"] += Number(json_data[i]["cpc"])*Number(json_data[i]["conversions"]) || 0;
                temp_object["revenue"] += Number(json_data[i]["revenue"]) || 0;
                temp_object["users"] += Number(json_data[i]["users"]) || 0;
                temp_object["new users"] += Number(json_data[i]["new users"]) || 0;
                temp_object["conversions"] += Number(json_data[i]["conversions"]) || 0;

                temp_object_parent["ads"] ++;
                temp_object_parent["cpu"] += Number(json_data[i]["cpu"])*Number(json_data[i]["users"]) || 0;
                temp_object_parent["cpc"] += Number(json_data[i]["cpc"])*Number(json_data[i]["conversions"]) || 0;
                temp_object_parent["cpnu"] += Number(json_data[i]["cpnu"])*Number(json_data[i]["new users"]) || 0;
                temp_object_parent["value"] += Number(cost.replace(",",".")) || 0;
                temp_object_parent["revenue"] += Number(json_data[i]["revenue"]) || 0;
                temp_object_parent["users"] += Number(json_data[i]["users"]) || 0;
                temp_object_parent["new users"] += Number(json_data[i]["new users"]) || 0;
                temp_object_parent["conversions"] += Number(json_data[i]["conversions"]) || 0;
                result["value"] += Number(cost.replace(",",".")) || 0;
                result["ads"] ++;
                result["cpu"] += Number(json_data[i]["cpu"])*Number(json_data[i]["users"]) || 0;
                result["cpnu"] += Number(json_data[i]["cpnu"])*Number(json_data[i]["new users"]) || 0;
                result["cpc"] += Number(json_data[i]["cpc"])*Number(json_data[i]["conversions"]) || 0;
                result["revenue"] += Number(json_data[i]["revenue"]) || 0;
                result["users"] += Number(json_data[i]["users"]) || 0;
                result["new users"] += Number(json_data[i]["new users"]) || 0;
                result["conversions"] += Number(json_data[i]["conversions"]) || 0;
                               
        };
        console.log(result["value"]);
        res.json({"data" : result});
        first_sheet = true;
    });
}

exports.trends_dataset = function(req, res){
    var result = null;
    var e = req.body.daterange,
        startDate = new Date(e.startValue),
        endDate = new Date(e.endValue);

    trendsworkbook.SheetNames.forEach(function(sheetName) {
        if (result != null)
            return;
        result = [];
        var json_data = XLSX.utils.sheet_to_json(trendsworkbook.Sheets[sheetName]);
        var limit = 2000;
        var count = 0;

        var data_matrix = new Array(8),
            count_matrix = new Array(8);
        for (var i = 0; i < 8; i++) {
            data_matrix[i] = new Array(8);
            count_matrix[i] = new Array(8);
            for(var j = 0; j < 8; j++) {
                data_matrix[i][j] = 0;
                count_matrix[i][j] = 0;
            }
        };
        for (var i = 0; i < json_data.length; i++) {
            if (limit == 0)
                break;
            var date = new Date(json_data[i]['datetime']);
            if(json_data[i]['network'] && date>=startDate && date<=endDate)
            {
                result.push(json_data[i]);
                var x, y;
                switch(json_data[i]['daypart'])
                {
                    case "Breakfast":
                        x = 0;
                        break;
                    case "Coffee":
                        x = 1;
                        break;
                    case "Daytime":
                        x = 2;
                        break;
                    case "Prepeak":
                        x = 3;
                        break;
                    case "EarlyPeak":
                        x = 4;
                        break;
                    case "LatePeak":
                        x = 5;
                        break;
                    case "PostPeak":
                        x = 6;
                        break;
                }
                switch(json_data[i]['weekday'])
                {
                    case "Monday":
                        y = 0;
                        break;
                    case "Tuesday":
                        y = 1;
                        break;
                    case "Wednesday":
                        y = 2;
                        break;
                    case "Thursday":
                        y = 3;
                        break;
                    case "Friday":
                        y = 4;
                        break;
                    case "Saturday":
                        y = 5;
                        break;
                    case "Sunday":
                        y = 6;
                        break;
                }
                data_matrix[x][y] += Math.round(Number(json_data[i]['cpnu'])) || 0;
                count_matrix[x][y] ++;
                limit--;
                count++;
            }
        }

        for(var i=0; i<7; i++) {
            for(var j=0; j<7; j++) {

                if(count_matrix[i][j]!=0) {
                    data_matrix[i][j] = Math.round(data_matrix[i][j] / count_matrix[i][j]);
                }

                data_matrix[i][7] += data_matrix[i][j] || 0;
                data_matrix[7][j] += data_matrix[i][j] || 0;
                data_matrix[7][7] += data_matrix[i][j] || 0;
            }
        }

        res.json({"data_matrix" : data_matrix});
    });
}

exports.breakdown_dataset = function(req, res){

    var result = null;

    workbook.SheetNames.forEach(function(sheetName) {
        if (result != null)
            return;
        result = [];
        var filter_list = {
            'daypart': [],
            'campaign': [],
            'creative': [],
            'length': [],
            'region': [],
            'device': [],
            'network': [],
            'channel': [],
        };

        var json_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        var limit = -1;

        for (var i = 0; i < json_data.length; i+=30) {
            if (limit == 0)
                break;

            if(json_data[i]['networks'])
            {
                result.push(json_data[i]);
                if(filter_list.daypart.indexOf(json_data[i]["Daytime"]) == -1)
                    filter_list.daypart.push(json_data[i]["Daytime"]);
                if(filter_list.campaign.indexOf(json_data[i]["campaign"]) == -1)
                    filter_list.campaign.push(json_data[i]["campaign"] || "");
                if(filter_list.creative.indexOf(json_data[i]["creative"]) == -1)
                    filter_list.creative.push(json_data[i]["creative"]);
                if(filter_list['length'].indexOf(json_data[i]["length"]) == -1)
                    filter_list['length'].push(json_data[i]["length"] || 0);
                if(filter_list.region.indexOf(json_data[i]["region"]) == -1)
                    filter_list.region.push(json_data[i]["region"] || "");
                if(filter_list.device.indexOf(json_data[i]["device"]) == -1)
                    filter_list.device.push(json_data[i]["device"]);
                if(filter_list.network.indexOf(json_data[i]["networks"]) == -1)
                    filter_list.network.push(json_data[i]["networks"]);
                if(filter_list.channel.indexOf(json_data[i]["channels"]) == -1)
                    filter_list.channel.push(json_data[i]["channels"]);
                limit--;
            }
        }
        res.json({"data" : result, "filter_list" : filter_list});
    });
}