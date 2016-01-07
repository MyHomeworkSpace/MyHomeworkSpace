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
window.overview.graph = function(values){
	//values is an array of data
	var myData = values;
	var myChart = new JSChart('chartid', 'line');
	myChart.setDataArray(myData);
	myChart.setLineColor('#000000');
	myChart.setLineWidth(4);
	myChart.setTitleColor('#7D7D7D');
	myChart.setAxisColor('#9F0505');
	myChart.setGridColor('#a4a4a4');
	myChart.setAxisValuesColor('#333639');
	myChart.setAxisNameColor('#333639');
	myChart.setTextPaddingLeft(0);
	myChart.draw();
}
function hello(){
	alert("Hi!");
}
