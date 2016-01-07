window.overview = {};

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
	});
});

function getHwPerDay(){
	var date = window.utils.formatDate_api(moment().add(1, day).toDate();
	var hwPerDay = [];
	for (i = 0; i < 10; i++) { 
		date1 = date + i;
		 window.api.get('/overview/events/getDay/', {date: date1}, function(res) {
   			alert(res);
   			hwPerDay.push(res);
   		});
	alert(hwPerDay);
	}
 
};
function hello(){
	alert("Hi!");
};
