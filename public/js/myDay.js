window.myDay = {

};

window.myDay.loadClubs = function(target, callback) {
	window.api.get("myDay/clubs/getAll", function(data) {
		for (var clubIndex in data.clubs) {
			var club = data.clubs[clubIndex];
			var option = $('<option></option>');
				option.val(club.clubId);
				option.text(club.name);
			target.append(option);
		};
		callback();
	});
};

$(document).ready(function() {
	window.myDay.loadClubs($(".myDay-club-select"), function() {
		$(".myDay-club-select").chosen();
	});
	$("#myDayHome").on("tabOpened", function() {
		window.page.showLoading();
		var monday = window.planner.findThisMonday();
		window.api.get("planner/announcements/getWeek/" + window.utils.formatDate_api(monday), function(data) {
			window.api.get("hwView/getHw?date=" + moment().format('YYYY-MM-DD'), function(hwViewData) {
				var announcements = [];
				if (data.status == "ok") {
					announcements = data.announcements;
				}
				console.log(hwViewData);
				$("#myDayCalendar").fullCalendar({
					header: {
						left: "title",
						middle: "",
						right: "agendaWeek,agendaDay today prev,next"
					},
					editable: true,
					droppable: true,
					drop: function() {
						// will do backendy stuff later
					}
				}).fullCalendar("changeView", "agendaWeek");
				for (var announcementIndex in announcements) {
					var announcement = announcements[announcementIndex];
					$("#myDayCalendar").fullCalendar("renderEvent", {
						title: announcement.text,
						start: announcement.date,
						allDay: true,
						editable: false
					});
				}
				window.page.hideLoading();
			});
		});

		$("#myDayEvents ul li").each(function() {
			$(this).data('event', {
				title: $.trim($(this).text()), // use the element's text as the event title
				stick: true // maintain when user navigates (see docs on the renderEvent method)
			});
			$(this).draggable({
				zIndex: 999,
				revert: true,      // will cause the event to go back to its
				revertDuration: 0  //  original position after the drag
			});
		});
	});
	$("#myDay-welcome-submit").click(function() {
		if ($("input[name=sleepHrs]").val().trim() == "" || $("input[name=WakeUpTime]").val().trim() == "" || $("input[name=Address]").val().trim() == "") {
			swal("You did something wrong, are all your forms filled out?")
		}
		else {
			swal("Yay!", "Now we will calculate your schedule.", "success")
			// Do Backend Crappy Algorithm complicated stuff
			setPage("myDayHome")
		}
		var prefs = {};
		prefs.sleep = $("input[name=sleepHrs]").val();
		prefs.wake = $("input[name=WakeUpTime]").val();
		prefs.address = $("input[name=Address]").val();
		prefs.clubs = "notsureifthisworkssoimputtingastringhere";
		prefs.schoolId = 42;
		window.api.post("myDay/info/set", prefs, function(resp) {});
	});
});
