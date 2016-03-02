window.planner = {
	currentStartDate: null,
	loadState: 0,
	subjectCount: 0,
	saving: false,
	movedID: 0,
	moveID: 0,
	titleOrder: null
};

window.planner.showSaving = function() {
	window.planner.saving = true;
	$("#planner-status").html('<i class="fa fa-refresh fa-spin"></i>');
	$("#planner-status").attr("title", "Saving...");
	$("#planner-status").attr("data-original-title", "Saving...");
	$("#planner").attr("data-exitPrompt", "We're currently saving your information. Please stay on the page.");
};

window.planner.showSaved = function() {
	window.planner.saving = false;
	$("#planner-status").html('<i class="fa fa-check"></i>');
	$("#planner-status").attr("title", "All data saved!");
	$("#planner-status").attr("data-original-title", "All data saved!");
	$("#planner").attr("data-exitPrompt", "");
};

window.planner.createSubjectRow = function(subjectName, subjectIndex) {
	var $row = $('<tr class="subjectRow"></tr>');
		$row.attr("data-subjectName", subjectName);
		$row.attr("data-subjectIndex", subjectIndex);

		var $subjectCell = $('<td class="subjectCell"></td>');
			$subjectCell.text(subjectName);

			var $controls = $('<div class="subjectControls"></div>');
				var $move = $('<button class="btn btn-xs btn-default planner-subject-handle"><i class="fa fa-arrows"></i></button>');
					$move.attr("data-subjectIndex", subjectIndex);
					$move.click(function() {
						window.planner.moveID = parseInt($(this).attr("data-subjectIndex"));
						$("#swap-subj-name").text($(this).parent().parent().text());
						var subjList = $.map($(".subjectRow"), function(val) {
							return { name: $(val).attr("data-subjectName"), index: $(val).attr("data-subjectIndex") };
						});
						$("#swap-subj-list").text("");
						for (var slIndex in subjList) {
							var item = subjList[slIndex];
							if (item.index == window.planner.moveID) {
								continue; // don't add self to list!
							}
							var $item = $('<li></li>');
								$item.text(item.name);
								$item.attr("data-subjectIndex", item.index);
								$item.click(function() {
									window.page.showLoading();
									window.api.post("planner/sections/swap", {
										first: window.planner.moveID,
										second: $(this).attr("data-subjectIndex")
									}, function() {
										window.location.reload();
									});
								});
							$("#swap-subj-list").append($item);
						}
						$("#planner-move-modal").modal();
					});
				$controls.append($move);

				var $renameBtn = $('<button class="btn btn-xs btn-default"><i class="fa fa-pencil"></i></button>');
					$renameBtn.click(function() {
						var subjectName = $(this).parent().parent().parent().attr("data-subjectName");
						var subjectIndex = $(this).parent().parent().parent().attr("data-subjectIndex");
						swal({
							title: "Rename subject",
							text: "Enter a new name for " + subjectName + ":",
							type: "input",
							showCancelButton: true,
							closeOnConfirm: false,
							animation: "slide-from-top",
							inputPlaceholder: "Write something"
						}, function(inputValue) {
							if (inputValue === false) {
								return false;
							}
							if (inputValue === "") {
								swal.showInputError("You need to write something!");
								return false;
							}
							window.page.showLoading();
							window.api.post("planner/sections/rename", {
								sectionIndex: subjectIndex,
								newName: inputValue
							}, function() {
								window.location.reload();
							});
						});
					});
				$controls.append($renameBtn);

				var $deleteBtn = $('<button class="btn btn-xs btn-danger"><i class="fa fa-trash-o"></i></button>');
					$deleteBtn.click(function() {
						var subjectName = $(this).parent().parent().parent().attr("data-subjectName");
						var subjectIndex = $(this).parent().parent().parent().attr("data-subjectIndex");
						swal({
							title: "Are you sure?",
							text: "Sure you want to delete '" + subjectName + "'? This is a permanent action.",
							type: "warning",
							showCancelButton: true,
							confirmButtonText: "Delete",
							cancelButtonText: "Cancel",
							closeOnConfirm: false,
							closeOnCancel: false
						}, function(isConfirm) {
							if (isConfirm) {
								swal("Deleted", "This subject has been deleted.", "success");
								window.page.showLoading();
								window.api.post("planner/sections/remove", {
									sectionIndex: subjectIndex
								}, function() {
									window.location.reload();
								});
							}
							else {
								swal("Cancelled", "Deletion cancelled.", "error");
							}
						});
					});
				$controls.append($deleteBtn);
			$subjectCell.append($controls);

			$subjectCell.mouseenter(function() {
				$(this).children(".subjectControls").css("opacity", "1");
			});
			$subjectCell.mouseleave(function() {
				$(this).children(".subjectControls").css("opacity", "0");
			});
		$row.append($subjectCell);

		var monday = window.planner.findThisMonday();
		var doneCheck = $('.editArea').val();
		for (var i = 0; i < 7; i++) {
			var $editCell = $('<td class="editCell"><textarea class="editArea"></textarea></td>');
				$editCell.attr("data-date", window.utils.formatDate_api(monday));
				var $checkBtn = $('<input type="checkbox" class="checkBtn" />');
					$checkBtn.change(function() {
						if ($(this).prop('checked') || (doneCheck !== undefined && (doneCheck.indexOf('no') > -1 || doneCheck.indexOf('none') > -1))) {
							$(this).parent().addClass("done");
						} else {
							$(this).parent().removeClass("done");
						}
					});
				$editCell.append($checkBtn);
				$editCell.mouseenter(function() {
					$(this).addClass("hover");
				});
				$editCell.mouseleave(function() {
					$(this).removeClass("hover");
				});

				$editCell.children("textarea").width("150px");
				$editCell.children("textarea").height("100px");
				var realWords = window.utils.getPrefixes();
				realWords.push({color:"cal_subjectName", words:[subjectName]});
				$editCell.children("textarea").highlightTextarea({
					words: realWords,
					firstWord: true,
					caseSensitive: false
				});
				/*$editCell.children("textarea").highlightTextarea({
					words: realWords,
					firstWord: true,
					caseSensitive: false
				}); */

				$editCell.find("textarea").keydown(function (evt) {
					var keycode = evt.charCode || evt.keyCode;
					if (keycode == 9) { //Tab key's keycode
						if($(this).attr("data-tabs") === undefined) {
							$(this).attr("data-tabs", -1);
						}
						var prefxs = [];
						var $that = $(this);
						for (var titleIndex in window.planner.titleOrder) {
							var titles = window.planner.titleOrder[titleIndex];
							if (titles.tabSystem) {
								for (var wordIndex in titles.words) {
									var title = titles.words[wordIndex];
									if (title == "subjectName") {
										title = subjectName;
									}
									prefxs.push(title);
								}
							}
						}
						if(parseInt($that.attr("data-tabs")) < prefxs.length - 1) {
							$that.attr("data-tabs", parseInt($that.attr("data-tabs")) + 1);
						} else {
							$that.attr("data-tabs", 0);
						}
						$that.val($that.val().replace(window.utils.getPrefix($that.val()), prefxs[parseInt($that.attr("data-tabs"))]));
						$that.trigger("input"); // reload the tag checker
						$that.trigger("change");
						return false;
					}
				});
				var textAreaChg = function() {
					var editCell = $(this).parent().hasClass("editCell");

					var subjectIndex = (editCell ? $(this).parent().parent().attr("data-subjectIndex") : $(this).parent().parent().parent().attr("data-subjectIndex"));
					var date = (editCell ? $(this).parent().attr("data-date") : $(this).parent().parent().attr("data-date"));
					var done = (editCell ? $(this).parent().hasClass("done") : $(this).parent().parent().hasClass("done"));
					var val = (editCell ? $(this).parent().children(".highlightTextarea").children("textarea").val() : $(this).val()); // fix this - editCell
					var $micDiv = (editCell ? $(this).parent().children(".highlightTextarea") : $(this).parent());

					if (val.indexOf("ey.hex(u);;;;;") >= 0) {
						swal("Warning", "You just typed something really dangerous.", "warning");
						$("body").addClass("fa-spin");
					}

					if ($micDiv.attr("data-donePass")) {
						var doneArr = $micDiv.attr("data-donePass").split("");
						// tbd
					}

					var texts = val.split("\n");
					var lines = 0;
					for (var textIndex in texts) {
						window.planner.setEvent(date, subjectIndex, texts[textIndex], done, textIndex);
						lines += 1;
					}
					window.planner.purgeDay(date, subjectIndex, lines);
				};
				$editCell.find("textarea").change(textAreaChg);
				$editCell.find(".checkBtn").change(textAreaChg);
				$editCell.find("textarea").click(function(clicky) {
					if (clicky.altKey) {
						if($(this).val() == "none") {
							$(this).val("");
							if ($(this).data("oldVal")) {
								$(this).val($(this).data("oldVal"));
							}
							$(this).trigger("input");
							$(this).trigger("change");
						} else {
							$(this).val("none");
							$(this).data("oldVal", $(this).val());
							$(this).trigger("input");
							$(this).trigger("change");
						}
					}
				});
				var $mic = $('<div class="magic-input-container"></div>');

				$mic.prepend("<div></div>");
				var prefixFunction = function () {
					/*var $ev = $(this).children("div").children("textarea");
					var $mic = $ev.parent().parent();
					if (($ev.val().length) && ($ev.val().split(' ').length)) {
						var eventNumber = $ev.val().trim().split("\n").length;
						var recreate = (
										$mic.children(".first-word").length == 0 || // if there are no first-words
										$mic.attr("data-events") != eventNumber // or if the number of events has changed
										);
						if (recreate) {
							$mic.children(".first-word").remove();
							var lines = 0;
							for (var i = 0; i < eventNumber; i++) {
								var $firstword = $('<div class="form-control first-word hiddenThing"></div>');
									$firstword.css("top", (8+(lines*18))+"px");
									$firstword.attr("data-eventIndex", i);
								$mic.append($firstword);
								lines += window.planner.getNumberOfLines($ev.val().split('\n')[i]);
							};
						}

						for (var i = 0; i < eventNumber; i++) {
							var prefix = window.utils.getPrefix($ev.val().split('\n')[i]);
							var $element = $(this).find('.first-word[data-eventIndex=' + i + ']');
							$element.text(prefix);
							//prefix = prefix.toLowerCase();
							$element.removeClass("cal_no_prefix");
							$element.removeClass("cal_hw");
							$element.removeClass("cal_project");
							$element.removeClass("cal_paper");
							$element.removeClass("cal_quiz");
							$element.removeClass("cal_test");
							$element.removeClass("cal_ica");
							$element.removeClass("cal_lab");
							$element.removeClass("cal_docid");
							$element.removeClass("cal_hex");
							$element.removeClass("cal_no_hw")

							$element.addClass(window.utils.getPrefixClass(prefix));
							$element.removeClass("hiddenThing");
							$mic.attr("data-events", eventNumber);
						};
					}
					else {
						$(this).find('.first-word').addClass("hiddenThing");
					}*/
				};
				$mic.on('keydown keyup change', prefixFunction);

				$editCell.children("textarea").wrap($mic);
				$row.append($editCell);

			monday.setDate(monday.getDate() + 1);
		}

	$("#planner table tbody").append($row);

	window.planner.subjectCount++;

	window.planner.calculateEventGridDates();
};

window.planner.calculateEventGridDates = function() {
	var monday = window.planner.currentStartDate;
	var offset = 0;
	$(".editCell").each(function() {
		$(this).attr("data-date", window.utils.formatDate_api(moment(monday).add(offset, "days").toDate()));
		offset++;
		if (offset > 6) {
			offset = 0;
		}
	});
};

window.planner.getNumberOfLines = function(text) {
	$("#planner-hacky-text-measure-thing").text(text);
	return $("#planner-hacky-text-measure-thing").height() / 21;
};

window.planner.setEvent = function(date, subjectIndex, text, done, subId) {
	window.planner.showSaving();
	window.api.post("planner/events/post/", {
		date: date,
		subjectIndex: subjectIndex,
		text: text,
		done: (done ? 1 : 0),
		subId: subId
	}, function(data) {
		window.planner.showSaved();
		console.log(data);
	});
};

window.planner.purgeDay = function(date, subjectIndex, lines) {
	window.planner.showSaving();
	window.api.post("planner/events/purgeLine/", {
		date: date,
		subjectIndex: subjectIndex,
		lines: lines
	}, function(data) {
		window.planner.showSaved();
		console.log(data);
	});
};

window.planner.handleError = function(metadata) {
	swal("Error","Something went wrong. Reload the page and try again.","error");
};

window.planner.getAnnouncement = function(date, callback) {
	window.api.get("planner/announcements/get/" + date, function(data) {
		if (data.status == "ok") {
			if (data.announcement !== null) {
				callback(data.announcement, date);
			}
		} else {
			window.planner.handleError(data);
		}
	});
};

window.planner.loadWholeWeek = function(startDate, subjectIndex) {
	window.api.get("planner/events/getWholeWeek/" + window.utils.formatDate_api(startDate), function(data) {
		for (var announcementIndex in data.announcements) {
			var announcement = data.announcements[announcementIndex];
			var date = announcement.date.split("T")[0];
			$("thead .announcement-row th[data-date=" + date + "]").text(announcement.text);
		}
		var evList = data.events;
		var eventMap = {};
		for (var evIndex in evList) {
			var ev = evList[evIndex];
			var happyDate = ev.date.split("T")[0];
			if (!eventMap[ev.sectionIndex]) {
				eventMap[ev.sectionIndex] = {};
			}
			if (!eventMap[ev.sectionIndex][happyDate]) {
				eventMap[ev.sectionIndex][happyDate] = [];
			}
			eventMap[ev.sectionIndex][happyDate].push(ev);
		}
		for (var evSectionIndex in eventMap) {
			var $row = $(".subjectRow[data-subjectIndex=" + evSectionIndex + "]");
			for (var eventMapIndex in eventMap[evSectionIndex]) {
				var evs = eventMap[evSectionIndex][eventMapIndex];
				var $cell = $row.children(".editCell[data-date=" + eventMapIndex + "]");
				var cellText = "";
				var doneStr = "";
				var first = true;
				for (var evsIndex in evs) {
					if (first) {
						first = false; // don't put a new line for the first subId
					} else {
						cellText += "\n";
					}
					cellText += evs[evsIndex].text;
					doneStr += evs[evsIndex].done;
					$cell.children(".checkBtn").prop("checked", (evs[evsIndex].done || $cell.children(".checkBtn").prop("checked")));
					if ($cell.children(".checkBtn").prop("checked") && !$cell.hasClass("done")) {
						$cell.addClass("done");
					}
				}
				cellText = cellText.trim();
				$cell.children(".highlightTextarea").children("textarea").val(cellText);
				$cell.children(".highlightTextarea").attr("data-donePass", doneStr);
				$cell.find(".editArea").trigger("input");
			}
		}
		window.planner.loadStep();
	});
};

window.planner.loadStep = function() {
	window.planner.loadState++;
	if (window.planner.loadState == (1 + 1 + 1)) { // one step plus friday step plus week load
		var $mic = $(".editCell textarea"); // tags
		$mic.trigger("input");
		window.page.hideLoading(); // done
	}
};

window.planner.loadWeek = function(startDate) {
	window.planner.loadState = 0;
	window.page.showLoading();

	var startDate_obj = new Date(startDate);

	if (startDate_obj.getDay() != 1) {
		throw new Error("startDate is not a Monday!");
	}

	window.planner.currentStartDate = new Date(startDate);

	$("#planner-week").text(window.utils.formatDate_pretty(startDate_obj));
	$(".planner-dow-friday").text("Friday");

	window.planner.calculateEventGridDates();

	var currentDate = startDate_obj;
	$("thead .announcement-row th").each(function() {
		if ($(this).hasClass("no-border")) {
			return;
		}

		$(this).text("");

		var apiDate = window.utils.formatDate_api(currentDate);
		var prettyDate = window.utils.formatDate_pretty(currentDate);
		$(this).attr("data-date", apiDate);

		/*window.planner.getAnnouncement(apiDate, function(announcement, date) {
			$("thead .announcement-row th[data-date=" + date + "]").text(announcement.text);
			window.planner.loadStep();
		});*/

		currentDate.setDate(currentDate.getDate() + 1);
	});

	startDate_obj = new Date(startDate);
	currentDate = startDate_obj;
	$("thead tr:first th").each(function() {
		if ($(this).hasClass("no-border")) {
			return;
		}

		var prettyDate = window.utils.formatDate_pretty(currentDate);
		$(this).children(".planner-day").text(prettyDate);

		currentDate.setDate(currentDate.getDate() + 1);
	});
	window.planner.loadStep();

	// CURRENT DATE SHOULD BE SUNDAY
	// STEP BACK TWICE
	currentDate.setDate(currentDate.getDate() - 1);
	currentDate.setDate(currentDate.getDate() - 1);

	// get friday
	currentDate.setDate(currentDate.getDate() - 1);
	window.api.get("planner/fridays/get/" + window.utils.formatDate_api(currentDate), function(data) {
		if (data.friday !== null) {
			$(".planner-dow-friday").text("Friday " + data.friday.index);
		}
		window.planner.loadStep();
	});

	startDate_obj = new Date(startDate);
	currentDate = startDate_obj;

	// clear grid
	$(".editArea").val("");
	$(".editCell").removeClass("done");
	$(".checkBtn").prop("checked", false);

	// load events
	/*startDate_obj = new Date(startDate);
	$(".subjectRow").each(function() {
		var index = $(this).attr("data-subjectIndex");*/
		var thisDate = new Date(startDate);

		window.planner.loadWholeWeek(thisDate); //, index);
	//});

	startDate_obj = new Date(startDate);
};

window.planner.findThisMonday = function() {
	var today = new Date();
	while (today.getDay() != 1) { // loop until a monday is found
		today.setDate(today.getDate() - 1);
	}
	return today;
};

window.planner.getSubjects = function(callback) {
	window.api.get("planner/sections/get/", function(data) {
		callback(data.sections);
	});
};

window.planner.addSubject = function(name) {
	window.api.post("planner/sections/add", { sectionName: name }, function(data) {
		window.planner.createSubjectRow(name, data.newIndex);
		$(".planner-welcome").addClass("hidden");
	});
};



$(document).ready(function() {
	$("#planner").on("tabOpened", function() {
		window.planner.subjectCount = 0;
		window.page.showLoading();
		$(".subjectRow").remove(); // clear the grid
		window.planner.getSubjects(function(subjects) {
			window.prefs.getJSONPref("titleOrder", function(titleOrder) {
				if(titleOrder === undefined) {
					titleOrder = window.utils.getTabPrefixes();
				}
				var loadedPrefixes = titleOrder;
				for (var prefixId in loadedPrefixes) {
					var prefix = loadedPrefixes[prefixId];
					var prefixObj;
					if (prefix.words === undefined) {
						prefixObj = {
							words: [ prefix ],
							tabSystem: true
						};
					} else {
						prefixObj = prefix;
					}
					loadedPrefixes.push(prefixObj);
				}
				window.planner.titleOrder = loadedPrefixes;

				for (var i = 0; i < subjects.length; i++) {
					window.planner.createSubjectRow(subjects[i].name, subjects[i].sectionIndex);
				}

				if (window.planner.subjectCount === 0) {
					$(".planner-welcome").removeClass("hidden");
				}

				window.planner.loadWeek(window.planner.findThisMonday().toString());
			});
		});
	});

	$(".add-subject").click(function() {
		swal({
			title: "Add subject",
			text: "What should it be called?",
			type: "input",
			showCancelButton: true,
			closeOnConfirm: false,
			animation: "slide-from-top",
			inputPlaceholder: "Type a name for it"
		},
		function(inputValue) {
			if (inputValue === false) {
				return false;
			}
			if (inputValue === "") {
				swal.showInputError("You need to write something!");
				return false
			}
			window.planner.addSubject(inputValue);
			swal.close();
		});
	});

	$("#planner-prev").click(function() {
		window.planner.loadWeek(moment(window.planner.currentStartDate).subtract(7, "days").toDate());
	});

	$("#planner-next").click(function() {
		window.planner.loadWeek(moment(window.planner.currentStartDate).add(7, "days").toDate());
	});

	$("#planner-jumpTo").click(function() {
		$.datepicker._gotoToday = function (id) {
			$(id).datepicker('setDate', new Date());
			$('.ui-datepicker-current-day').click();
			/*.datepicker('hide').blur();*/
		};
		$("body").datepicker("dialog", window.planner.currentStartDate, function(dateStr) {
			var monday = moment(dateStr);
			while (monday.day() != 1) {
				monday.subtract(1, "day");
			}
			window.planner.loadWeek(monday.toDate());
		}, {
			showButtonPanel: true
		});
	});
});
