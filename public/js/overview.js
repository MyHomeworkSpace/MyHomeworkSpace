window.overview = {};

$(document).ready(function() {
	$("#overview").on("tabOpened", function() {
		$(".overview-date").text(window.utils.formatDate_english(new Date()));
	});
});

function lolzPlanBot(date) {
        list = []
        for (i in range(5)){
        	list[i] = getHw(date)
        }//return an array with a score for each day
}

function getHw(date){
	//gets hw for a date
}
