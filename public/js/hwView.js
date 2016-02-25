window.hwView = {
	subjects: {},
	loadCount: 0,
	swapOrder: false,
	disableChecks: false
};

window.hwView.addEventToList = function(ev, list) {
	var tag = window.utils.getPrefix(ev.name);
	var name = ev.name.split(" ");
	name.splice(0, 1);
	name = name.join(" ");
	var done = (ev.done == 1 ? true : false);

	if (tag.toLowerCase() == "none" || tag.toLowerCase() == "nohw") {
		return;
	}
	if (name.trim() === "") {
		return;
	}

	var $item = $('<li class="hwView-item"></li>');
		if (done) {
			$item.addClass("hwView-done");
		}
		$item.attr("data-subId", ev.subId);
		var hexyTime = moment(ev.due).subtract(moment().utcOffset(), "minutes");
		$item.attr("data-date", window.utils.formatDate_api(hexyTime.toDate()));
		$item.attr("data-sectionIndex", ev.subject);
		$item.attr("data-name", ev.name);
		var $checkbox = $('<input type="checkbox" class="hwView-toggleDone"></input>');
			$checkbox.prop("checked", done);
			$checkbox.change(function() {
				var subId = parseInt($item.attr("data-subId"));
				var date = $item.attr("data-date");
				var sectionIndex = parseInt($item.attr("data-sectionIndex"));
				var name = $item.attr("data-name");
				var doneNow = $(this).prop("checked");

				if (doneNow) {
					$(this).parent().addClass("hwView-done");
				} else {
					$(this).parent().removeClass("hwView-done");
				}

				window.planner.setEvent(date, sectionIndex, name, doneNow, subId);
			});
		if (!window.hwView.disableChecks) {
			$item.append($checkbox);
		}
		var $name = $('<h4></h4>');
			$name.text(name);
		// append comes later

		var $lineTwo = $('<h4></h4>');
			var $tag = $('<span></span>');
				$tag.addClass("first-word");
				if (tag.toLowerCase() == "read" && tag != "READ") {
					tag = tag + "ing";
				} else if (tag == "READ") {
					tag = tag + "ING";

				}
				if(window.hwView.clr) {
					$tag.css("color", "black");
				} else if (tag == window.hwView.subjects[ev.subject].name) {
					$tag.addClass("cal_subjectName");
 				} else {
					$tag.addClass(window.utils.getPrefixClass(tag));
				}

				$tag.text(tag);
			$lineTwo.append($tag);

			var $subject = $('<span></span>');
				$subject.text(" in " + window.hwView.subjects[ev.subject].name);
			$lineTwo.append($subject);

			var $due = $('<span></span>');
				var keyword = "due";
				if (tag.toLowerCase() == "test" || tag.toLowerCase() == "exam" || tag.toLowerCase() == "midterm" || tag.toLowerCase() == "quiz" || tag.toLowerCase() == "ica" || tag.toLowerCase() == "lab") {
					keyword = "on";
				}
				if (tag.toLowerCase() == "study") {
					keyword = "by";
				}
				if (tag.toLowerCase() == "optionalhw" || tag.toLowerCase() == "challenge") {
					keyword = "due (optional)"
				}
				if (tag.toLowerCase() == "hex"){
					keyword = "- ey.hex(u);;;;; by"
				}
				var dueText = window.utils.formatDate_pretty(moment(ev.due).add(1, "day").toDate());
				if (moment(ev.due).add(1, "day").week() == moment().week()) {
					dueText = window.utils.getDayOfWeek(moment(ev.due).add(1, "day").day());
				}
				$due.text(" " + keyword + " " + dueText);
			$lineTwo.append($due);
		// append comes later

		if (window.hwView.swapOrder) {
			$item.append($lineTwo);
			$item.append($name);
		} else {
			$item.append($name);
			$item.append($lineTwo);
		}

	$(".hwView-" + list + " ul").append($item);
};

window.hwView.loadList = function(date, list, callback) {
	for (var subjectIndex in window.hwView.subjects) {
		window.api.get("planner/events/get/" + window.utils.formatDate_api(date) + "/" + subjectIndex, function(data) {
			var ev = data.events;
			window.hwView.loadStep();
			if (ev.length === 0) {
				return;
			}
			for (var evIndex in ev) {
				var evObj = {
					name: ev[evIndex].text,
					due: new Date(data.date),
					subject: ev[evIndex].sectionIndex,
					done: ev[evIndex].done,
					subId: ev[evIndex].subId
				};
				window.hwView.addEventToList(evObj, list);
			}
		});
	}
};

window.hwView.loadSubjects = function(callback) {
	window.hwView.subjects = {};
	window.api.get("planner/sections/get/", function(data) {
		for (var i = 0; i < data.sections.length; i++) {
			var itm = data.sections[i];
			window.hwView.subjects[itm.sectionIndex] = itm;
		}
		callback(data.sections);
	});
};

window.hwView.findNextDay = function(offset) {
	var retVal = moment(); //moment().add("days", offset);
	if (retVal.day() == 6) {
		// don't start on Saturday
		retVal.add(1, "day");
	}
	for (var i = 0; i < offset; i++) {
		retVal.add(1, "day"); //add a day
		// is it a Saturday?
		if (retVal.day() == 6) {
			retVal.add(2, "day"); // skip the weekend
		}
	}
	return retVal.toDate();
};

window.hwView.loadStep = function() {
	window.hwView.loadCount += 1;
	if (window.hwView.loadCount >= 2) { //(1 + (14 * Object.keys(window.hwView.subjects).length))) {
		window.page.hideLoading();
		if ($(".hwView-tomorrow ul").text() === "" && $(".hwView-soon ul").text() === "" && $(".hwView-longterm ul").text() === "") {
			// empty!
			swal("You don't have any homework in your planner!", "Once you've written some assignments in, come back here.", "warning");
		}
	}
};

window.hwView.loadEvents = function(callback) {
	window.hwView.loadSubjects(function(data) {
		window.hwView.loadStep();
		window.api.get("hwView/getHw?date=" + moment().format('YYYY-MM-DD'), function(data) {
			var ev = data.events;
			if (ev.length === 0) {
				window.hwView.loadStep();
				return;
			}
			for (var evIndex in ev) {
				var evObj = {
					name: ev[evIndex].text,
					due: new Date(ev[evIndex].date.split("T")[0]),
					subject: ev[evIndex].sectionIndex,
					done: ev[evIndex].done,
					subId: ev[evIndex].subId
				};
				var list = "longterm";
				var dueMoment = moment(evObj.due).utcOffset(0);
				var tomorrow = moment(window.hwView.findNextDay(1)).date();
				if (dueMoment.date() == tomorrow && dueMoment.month() == moment(window.hwView.findNextDay(1)).month() && dueMoment.year() == moment(window.hwView.findNextDay(1)).year()) { // moment.isSame didn't work here. /shrug
					list = "tomorrow";
				} else if (dueMoment.isBefore(moment(window.hwView.findNextDay(5)).subtract(1, "day"))) {
					list = "soon";
				}
				window.hwView.addEventToList(evObj, list);
			}
			window.hwView.loadStep();
		});
		/*window.hwView.loadStep();
		window.hwView.loadList(window.hwView.findNextDay(1), "tomorrow", function() {

		});
		window.hwView.loadList(window.hwView.findNextDay(2), "soon", function() {

		});
		window.hwView.loadList(window.hwView.findNextDay(3), "soon", function() {

		});
		window.hwView.loadList(window.hwView.findNextDay(4), "soon", function() {

		});
		window.hwView.loadList(window.hwView.findNextDay(5), "longterm", function() {

		});
		window.hwView.loadList(window.hwView.findNextDay(6), "longterm", function() {

		});
		window.hwView.loadList(window.hwView.findNextDay(7), "longterm", function() {

		});
		window.hwView.loadList(window.hwView.findNextDay(8), "longterm", function() {

		});
		window.hwView.loadList(window.hwView.findNextDay(9), "longterm", function() {

		});
		window.hwView.loadList(window.hwView.findNextDay(10), "longterm", function() {

		});
		window.hwView.loadList(window.hwView.findNextDay(11), "longterm", function() {

		});
		window.hwView.loadList(window.hwView.findNextDay(12), "longterm", function() {

		});
		window.hwView.loadList(window.hwView.findNextDay(13), "longterm", function() {

		});
		window.hwView.loadList(window.hwView.findNextDay(14), "longterm", function() {

		});*/
	});
	callback();
};

$(document).ready(function() {
	$("#hwView").on("tabOpened", function() {
		window.page.showLoading();
		window.hwView.loadCount = 0;
		// clear lists
		$(".hwView-tomorrow ul").text("");
		$(".hwView-soon ul").text("");
		$(".hwView-longterm ul").text("");
		// special case for checking on Friday, Saturday, or Sunday
		if (moment().day() === 0 || moment().day() == 5 || moment().day() == 6) {
			$(".tomorrow-or-monday").text("Monday"); // the part that makes it show Monday stuff is in findNextDay().
		} else {
			$(".tomorrow-or-monday").text("tomorrow");
		}
		window.prefs.get("name-subj", function(val) {
			window.hwView.swapOrder = (val == "1");
			window.prefs.get("titleclr", function(val) {
				window.hwView.clr = (val == "1");
				window.prefs.get("hwView-checkboxes", function(val) {
					window.hwView.disableChecks = (val == "1");
					window.hwView.loadEvents(function() {
					});
				});
			});

		});
	});
});
