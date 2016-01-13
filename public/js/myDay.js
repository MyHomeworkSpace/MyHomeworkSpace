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
		$("#myDayCalendar").fullCalendar();
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
