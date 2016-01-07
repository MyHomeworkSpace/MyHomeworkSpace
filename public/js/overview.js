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
	var days = [];
	
	var hwResult;
	var hws = [0,0,0,0,0,0,0];
	window.api.get('planner/events/getWholeWeek/' + window.utils.formatDate_api(moment().add(i, "days").toDate()), function(result) {
	    var hwResult = result.events;
		
	    console.log(result.events.length);
	    var date = window.utils.formatDate_api(moment().toDate());
	    for (var i=0;i<result.events.length;i++){
			console.log(i);
			var iDate = window.utils.formatDate_api(moment(hwResult[i]["date"]).toDate());
			console.log(iDate);
	        var dayToAssign = (parseInt(iDate[8] + iDate[9])) - parseInt(date[8] + date[9]);console.log(dayToAssign);
	        hws[dayToAssign] += 1;    
	    }
	});
	
 	
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
 	//how do i include this '<script src="http://canvasjs.com/assets/script/canvasjs.min.js"></script>''
 	
 }
function hello(){
	alert("Hi!");
}
