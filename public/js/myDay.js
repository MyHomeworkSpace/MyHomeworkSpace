window.myDay = {

};

window.myDay.loadClubs = function(target, callback) {
	window.api.get("myDay/clubs/getAll", function(data) {
		//data.clubs
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
	$(".myDay-club-select").chosen();
	window.myDay.loadClubs($(".myDay-club-select"), function() {

	});
	$("#myDay").on("tabOpened", function() {
		
	});
	$("#myDay-welcome-submit").click(function() {
		alert("Doesn't work yet!");
	});
});