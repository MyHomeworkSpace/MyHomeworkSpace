window.overview = {};

$(document).ready(function() {
	$("#overview").on("tabOpened", function() {
		$(".overview-date").text(window.utils.formatDate_english(new Date()));
	});
	window.api.get('overview/announcements/get/', function(data) {
		var response = data.feedback;
		for(feed in response) {
			if(moment(response[feed].time).toDate().add(response[feed].days, "days").isAfter(moment())) {
				var $feedLi = $("<li></li>");
					$feedLi.text(response[feed].msg);
					$("#announcementList").append($feedLi);
			}
		}
		if($("#announcementList").children().size() > 1) {
			$("#noAnnouncements").remove()
		}
	});
});
