function setPage(newPage) {
	$(".page.open-page").removeClass("open-page");
	if ($("#" + newPage).length != 0) {
		// yay, it exists. go to it
		$("#" + newPage).addClass("open-page");
		if ($(".upsell[data-feature=" + newPage + "]").length == 0) {
			$("#" + newPage).trigger("tabOpened");
		}
		window.location.hash = newPage;
	} else {
		// fetch it!
		window.api.get("pageHandler/fetchPage/" + newPage, function(response) {
			// check for error
			if (response.status === "error") {
				console.error("Error loading page!");
				return;
			}

			// and load it
			var $page = $(response);

			var $scripts = $page.children("planhub-page-scripts");
			$("head").append($scripts);

			var $styles = $page.children("planhub-page-styles");
			$("head").append($styles);

			var $modals = $page.children("planhub-page-modals");
			$("body").append($modals);

			var $upsell = $page.children("planhub-page-upsell");
				$upsell.attr("id", newPage + "-upsell");
				$upsell.addClass("upsell");
				$upsell.addClass("row");
				$upsell.attr("data-feature", newPage);
			var $content = $page.children("planhub-page-content");
				$content.attr("id", newPage);
				$content.addClass("page");
				if (window.page.features.indexOf(newPage) == -1) {
					$content.append($upsell);
				}
			$("body").append($content);

			//setPage(newPage); // and show it
		});
	}
}

window.page = {
	features: [],
	loadTimeout: null,
	loadWarnTimeout: null
};

window.page.getBasePath = function() {
	return $("#basePath").text();
};

window.page.showLoading = function() {
	window.page.loadTimeout = setTimeout(function() {
		$(".loadOverlay").addClass("showLoadOverlay");
		$(".loadWarn").removeClass("showingLoadWarn");
		window.page.loadWarnTimeout = setTimeout(function() {
			console.warn("Loading is taking time...");
			$(".loadWarn").addClass("showingLoadWarn");
		}, 10000);
	}, 400);
};

window.page.hideLoading = function() {
	$(".loadOverlay").removeClass("showLoadOverlay");
	if (window.page.loadTimeout != null) {
		clearTimeout(window.page.loadTimeout);
	}
	if (window.page.loadWarnTimeout != null) {
		clearTimeout(window.page.loadWarnTimeout);
	}
	window.page.loadTimeout = 0;
	window.page.loadWarnTimeout = 0;
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

window.page.getOpenPage = function() {
	return $(".page.open-page").attr("id");
};

// default color is #333333 and complement is #222222
window.page.setColor = function(color, complement) {
	window.page.color = color;
	window.page.complement = complement;

	$(".tabs").css("background-color", color);
	$(".navbar-default").css("background-color", color);
	$("#page-pref-btn").css("background-color", color);
	$(".navbar-default .dropdown-menu").css("background-color", color);

	$(".tabs").css("border-right", "solid 1px " + complement);
	$("#page-pref-btn").css("border-color", complement);
	$.each(["#page-pref-btn", ".tabs li", ".navbar-default .navbar-nav>li>a"], function() {
		$(this.toString()).off("mouseenter").off("mouseleave").mouseenter(function() {
			$(this).css("background-color", window.page.complement);
		}).mouseleave(function() {
			$(this).css("background-color", window.page.color);
		});
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

window.page.openFeedbackModal = function(type) {
	var desc = "Liked a feature? Found something helpful? Tell us what you like! We'd love to hear it, and your feedback helps us make even better things in the future!";
	if (type == "frown") {
		desc = "Annoyed by something? Found a glitch? Hate how something works? Tell us! We'd love to help you and improve PlanHub.";
	} else if (type == "idea") {
		desc = "Have an idea for a new feature? Something that helps you? A tweak to make your life easier? Tell us! We'd love to include it and make PlanHub even better!";
	}

	$("#feedback-modal-title-first").text("Send a ");
	if (type == "idea") {
		$("#feedback-modal-title-first").text("Send an ");
	}
	$(".feedback-type").text(type);
	$(".feedback-desc").text(desc);

	$("#feedback-modal").modal();
};

$(document).ready(function() {
	window.page.showLoading();

	$('[data-toggle="tooltip"]').tooltip({
		container: 'body'
	});

	$(".tabs li").click(function() {
		setPage($(this).attr("data-page"));
	});

	$(".go-dropdown li a").click(function() {
		setPage($(this).attr("data-page"));
	});

	$(".admin-link").click(function() {
		setPage($(this).attr("data-page"));
	});

	$("#page-pref-btn").click(function() {
		window.prefs.openModal(window.page.getOpenPage());
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

	$(".ideaBtn").click(function() {
		window.page.openFeedbackModal("idea");
	});

	$(".smileBtn").click(function() {
		window.page.openFeedbackModal("smile");
	});

	$(".frownBtn").click(function() {
		window.page.openFeedbackModal("frown");
	});

	$(".loadWarn button").click(function() {
		window.location.reload();
	})

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
			swal("Awesome!", "Your feedback has been sent successfully! We'll try to respond to you as soon as possible.", "success")
		});
	});

	// check for new layout
	window.prefs.get("topTabs", function(val) {
		if (val == "1") {
			$("head").append('<link href=" ' + $("#basePath").text() + '/css/topTabs.css" rel="stylesheet" />');
		}
	});

	window.page.getFeatures(function(features) {
		for (var i = features.length - 1; i >= 0; i--) {
			$(".upsell[data-feature=" + features[i] + "]").remove();
		}
		$(".upsell").each(function() {
			$(this).parent().addClass("hasUpsell");
		});

		window.page.features = features;
		window.page.hideLoading();

		if (window.location.hash != "") {
			setPage(window.location.hash.substr(1));
		} else {
			setPage("overview");
		}

		if (features.length == 0) {
			introJs().setOption("showStepNumbers", false).start();
		}
	});
});
