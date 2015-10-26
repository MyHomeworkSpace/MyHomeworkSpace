function setPage(newPage) {
	$(".page.open-page").removeClass("open-page");
	$("#" + newPage).addClass("open-page");
	$("#" + newPage).trigger("tabOpened");
	window.location.hash = newPage;
}

window.page = {};
window.page.getBasePath = function() {
	return $("#basePath").text();
};

window.page.showLoading = function() {
	$(".loadOverlay").show();
};

window.page.hideLoading = function() {
	$(".loadOverlay").hide();
};

window.page.getFeatures = function(callback) {
	window.api.get("features/get/", function(data) {
		callback(data.features);
	});
};

window.page.addFeature = function(feature, callback) {
	window.api.post("features/add/", { feature: feature }, function(data) {
		callback();
	});
};

window.page.sendFeedback = function(type, msg, name, username, webpage, callback) {
	// if the user does not want to send the webpage, the variable will be set to undefined, so don't do any checks here.
	window.api.post("feedback/post/", {
		type: type,
		msg: msg, 
		name: name,
		username: username,
		webpage: webpage
	}, function(data) {
		callback();
	});
};

window.page.openFeedbackModal = function(happy) {
	var type = "smile";
	var desc = "Liked a feature? Found something helpful? Tell us what you like! We'd love to hear it, and your feedback helps us make even better things in the future!";
	if (!happy) {
		type = "frown";
		desc = "Annoyed by something? Found a glitch? Hate how something works? Tell us! We'd love to help you and improve the site.";
	}

	$(".feedback-type").text(type);
	$(".feedback-desc").text(desc);

	$("#feedback-modal").modal();
};

$(document).ready(function() {
	window.page.showLoading();

	$('[data-toggle="tooltip"]').tooltip();

	$(".tabs li").click(function() {
		setPage($(this).attr("data-page"));
	});

	$(".upsell-btn").click(function() {
		var feature = $(this).attr("data-feature");

		window.page.showLoading();

		window.page.addFeature(feature, function() {
			window.location.hash = feature;
			window.location.reload();
		});

		//$(".upsell[data-feature=" + feature + "]").remove();
	});

	$(".smileBtn").click(function() {
		window.page.openFeedbackModal(true);
	});

	$(".frownBtn").click(function() {
		window.page.openFeedbackModal(false);
	});

	$("#feedback-submit").click(function() {
		var webpage = undefined;
		if ($("#feedback-snapshot").prop("checked")) {
			// if checkbox is checked, send copy of the webpage
			webpage = window.utils.b64EncodeUnicode($("html").html().toString());
		}
		$(".feedback-footer-normal").addClass("hidden");
		$(".feedback-footer-load").removeClass("hidden");
		window.page.sendFeedback($(".feedback-type:first").text(), $("#feedback-msg").val(), $(".user-name:first").text(), $("#username").text(), webpage, function() {
			$(".feedback-footer-load").addClass("hidden");
			$(".feedback-footer-normal").removeClass("hidden");
			$("#feedback-msg").val("");
			$("#feedback-modal").modal("hide");
			alert("Your feedback has been sent successfully! We'll try to respond to you as soon as possible.");
		});
	});

	window.page.getFeatures(function(features) {
		for (var i = features.length - 1; i >= 0; i--) {
			$(".upsell[data-feature=" + features[i] + "]").remove();
		}

		window.page.hideLoading();

		if (window.location.hash != "") {
			setPage(window.location.hash.substr(1));
		}
	});
});