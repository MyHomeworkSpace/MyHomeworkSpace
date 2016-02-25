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
		document.getElementById(id).innerHTML = '<i class="fa fa-smile-o"></i> Looks like tonight will be an easy night! You have noj homework due tomorrow!';
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