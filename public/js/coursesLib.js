/*
 * CoursesLib
 * This file contains useful helper functions that do various course- and event-related tasks.
 */
window.coursesLib = {};

window.coursesLib.baseUrl = "https://courses2016.dalton.org";

window.coursesLib.checkLoggedIn = function(doneFunc) {
	$.get(window.coursesLib.baseUrl + "/login/index.php", function (resText) {
		var $response = $(resText);
		var respObj = {};

		respObj.isLoggedIn = ($response.find(".loginform").length == 0);

		doneFunc(respObj);
	});
};

window.coursesLib.getCourseEvents = function(courseId, doneFunc) {
	$.get(window.coursesLib.baseUrl + "/course/view.php" + "?id=" + courseId, function (resText) {
		var $response = $(resText);
		var respObj = {};

		respObj.id = courseId;
		respObj.title = $response.children("#page-content")
								.children("#region-main-box")
								.children("#region-post-box")
								.children("#region-main-wrap")
								.children("#region-main")
								.children("#region-main-box")
								.children(".region-content")
								.children(".course-content")
								.text();

		doneFunc(respObj);
	});
};

window.coursesLib.getCourseInfo = function(courseId, doneFunc) {
	$.get(window.coursesLib.baseUrl + "/course/view.php" + "?id=" + courseId, function (resText) {
		var $response = $(resText);
		var respObj = {};

		respObj.id = courseId;
		respObj.title = $response.children("#page-header").children(".headermain").text();

		doneFunc(respObj);
	});
};

window.coursesLib.getCourseList = function(doneFunc) {
	$.get(window.coursesLib.baseUrl + "/index.php?redirect=0", function (resText) {
		var $response = $(resText);
		var respObj = {};

		respObj.classes = [];
		$response.find(".coursename > a").each(function() {
			respObj.classes.push({	courseId: parseInt($(this).attr("href").replace(window.coursesLib.baseUrl + "/course/view.php?id=", "")),
									name: $(this).text(),
									url: $(this).attr("href")
								});
		})

		doneFunc(respObj);
	});
};

window.coursesLib.getUpcomingCourseEvents = function(courseId, doneFunc) {
	$.get(window.coursesLib.baseUrl + "/calendar/view.php" + "?course=" + courseId, function (resText) {
		var $response = $(resText);
		var respObj = {};

		respObj.id = courseId;
		respObj.events = [];

		$response.find(".eventlist")
					.children(".event").each(function() {
						// !!!
						var eventTitle = $(this).children(".referer").children("a").text().replace(/\s{2,}/g, " ");
						if ($(this).children(".referer").length == 0) {
							eventTitle = $(this).children(".name").text().replace(/\s{2,}/g, " ");
						}
						var eventCourse = $(this).children(".course").children("a").text().replace(/\s{2,}/g, " ");
						var eventHtml = $(this).children(".description").html();
						var eventText = $(this).children(".description").text();
						var eventNormText = eventText.replace(/\r/g, "").replace(/\n/g, " ");
						var eventLink = $(this).children(".referer").children("a").attr("href");

						var eventObj = {title: eventTitle, course: eventCourse, text: eventText, normText: eventNormText, html: eventHtml, link: eventLink};

						respObj.events.push(eventObj);
					});

		doneFunc(respObj);
	});
};

window.coursesLib.getUpcomingEvents = function(doneFunc) {
	$.get(window.coursesLib.baseUrl + "/calendar/view.php", function (resText) {
		var $response = $(resText);
		var respObj = {};

		respObj.events = [];

		$response.find(".eventlist")
					.children(".event").each(function() {
						// !!!
						var eventTitle = $(this).children(".referer").children("a").text().replace(/\s{2,}/g, " ");
						if ($(this).children(".referer").length == 0) {
							eventTitle = $(this).children(".name").text().replace(/\s{2,}/g, " ");
						}
						var eventCourse = $(this).children(".course").children("a").text().replace(/\s{2,}/g, " ");
						var eventHtml = $(this).children(".description").html();
						var eventText = $(this).children(".description").text();
						var eventNormText = eventText.replace(/\r/g, "").replace(/\n/g, " ");
						var eventLink = $(this).children(".referer").children("a").attr("href");

						var eventObj = {title: eventTitle, course: eventCourse, text: eventText, normText: eventNormText, html: eventHtml, link: eventLink};

						respObj.events.push(eventObj);
					});

		doneFunc(respObj);
	});
};

window.coursesLib.getProfile = function(doneFunc) {
	$.get(window.coursesLib.baseUrl + "/user/profile.php", function (resText) {
		var $response = $(resText);
		var respObj = {};

		respObj.fullName = $response.find(".userprofile").children("h2").text();
		respObj.firstName = respObj.fullName.split(' ')[0];
		respObj.lastName = respObj.fullName.split(' ')[1];
		respObj.avatarUrl = $response.find(".userpicture").attr("src");

		doneFunc(respObj);
	});
};

console.log("CoursesLib ready!");
