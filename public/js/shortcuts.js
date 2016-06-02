$(document).ready(function() {
	// is this elegant? no
	// does it work? yes
	Mousetrap.bind('ctrl+shift+1', function() {
		setPage("overview");
	});
	Mousetrap.bind('ctrl+shift+2', function() {
		setPage("planner");
	});
	Mousetrap.bind('ctrl+shift+3', function() {
		setPage("hwView");
	});
	Mousetrap.bind('ctrl+shift+4', function() {
		setPage("prefs");
	});
});
