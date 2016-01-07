window.overview = {};

var tomorrow = window.utils.formatDate_api(moment().add(1, "days").toDate())

$(document).ready(function() {
	$("#overview").on("tabOpened", function() {
		$(".overview-date").text(window.utils.formatDate_english(new Date()));
		window.api.get('overview/announcements/get/', function(data) {
			$("#announcementList").text("");
			var response = data.feedback.reverse();
			for (var feed in response) {
				if (moment(response[feed].time).add(response[feed].days, "days").isAfter(moment())) {
					var $feedLi = $("<li></li>");
						$feedLi.append(response[feed].msg);
					$("#announcementList").append($feedLi);
				}
			}
			if ($("#announcementList").children().size() > 0) {
				$("#announcementAlert").css("display", "block");
			} else {
				$("#announcementAlert").css("display", "none");
			}
		});
		window.api.get('/planner/events/getDay/' + tomorrow, function(result) {
			window.overview.HWphrase("howmuchhw", result.events.length);
		});
	});
});

window.overview.HWphrase = function (id, hw) {
	if(hw < 1){
		document.getElementById(id).innerHTML = '<i class="fa fa-smile-o"></i> Looks like tonight will be an easy night! You have no homework due tomorrow!';
	} else if (hw < 3) {
		if (hw === 1){
			document.getElementById(id).innerHTML = '<i class="fa fa-smile-o"></i> It seems like you will have some free time tonight! You have ' + hw + ' assignment due tomorrow.';
		} else {
			document.getElementById(id).innerHTML = '<i class="fa fa-smile-o"></i> It seems like you will have some free time tonight! You have ' + hw + ' assignments due tomorrow.';
		}
	} else if (hw < 5){
		document.getElementById(id).innerHTML = '<i class="fa fa-frown-o"></i> Tonight might be rough. You have ' + hw + ' assignments due tomorrow.';
	} else {
		document.getElementById(id).innerHTML = '<i class="fa fa-frown-o"></i> You might be up late doing homework tonight. You have ' + hw + ' assignments due tomorrow.';
	}
}

window.overview.graph = function(){
	//get data
	days = [];
	for (i=0,i<=7,i++){
		window.api.get('/overview/announcements/getDay/' + window.utils.formatDate_api(moment().add(i, "days").toDate()), function(result) {
			days.push(result.result);
			});
	}
	//set up axis for graph
	switch (new Date().getDay()) {
	    	case 0:
			days = ["Sunday","Monday","Tuesday","Wensday","Thursday","Friday","Saturday"];
			break;
	    	case 1:
			days = ["Monday","Tuesday","Wensday","Thursday","Friday","Saturday","Sunday"];
			break;
	    	case 2:
			days = ["Tuesday","Wensday","Thursday","Friday","Saturday","Sunday","Monday"];
			break;
	    	case 3:
			days = ["Wensday","Thursday","Friday","Saturday","Sunday","Monday","Tuesday"];
			break;
	    	case 4:
			days = ["Thursday","Friday","Saturday","Sunday","Monday","Tuesday","Wensday"];
			break;
	    	case 5:
			days = ["Friday","Saturday","Sunday","Monday","Tuesday","Wensday","Thursday"];
			break;
	    	case 6:
			days = ["Saturday","Sunday","Monday","Tuesday","Wensday","Thursday","Friday"];
			break;
	}
		var data = {
	    		labels: {},
	    		datasets: [
	        		{
	            		label: "Homework Per Day",
	            		fillColor: "rgba(220,220,220,0.2)",
	            		strokeColor: "rgba(220,220,220,1)",
	            		pointColor: "rgba(220,220,220,1)",
	            		pointStrokeColor: "#fff",
	            		pointHighlightFill: "#fff",
	            		pointHighlightStroke: "rgba(220,220,220,1)",
	            		data: {}]
	        },
	}
	data.datasets.data = [data[0], data[1], data[2], data[3], data[4], data[5], data[6];
	data.lavels = days;
	
	//create table alex i think this is wrong please help
	
	document.getElementById('graph').innerHTML = '<canvas id="myChart" width="400" height="400"></canvas>';
	var ctx = document.getElementById("myChart").getContext("2d");
	var myLineChart = new Chart(ctx).Line(data);
}
function hello(){
	alert("Hi!");
}
