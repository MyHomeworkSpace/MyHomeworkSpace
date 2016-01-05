$(document).ready(function() {
	$("#schedules-connect").click(function() {
		$("#login-to-schedules-modal").modal();
	});
	$("#schedule-lab-student").click(function() {
		swal("Schedule a Lab!", "Schedule a Lab with a teacher. Just click the button below...", "success");
	});
	$("#accept-labs-teacher").click(function() {
		swal("Nice!", "You are now accepting Labs from students! (Pssst guys make this do something)", "success");
	});
});
