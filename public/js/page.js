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
		window.page.showLoading();
		window.api.get("pageHandler/fetchPage/" + newPage, function(response) {
			// check for error
			if (response.status === "error") {
				console.error("Error loading page!");
				return;
			}

			// and load it
			var $page = $(response);

			var $styles = $page.children("#page-styles");
			$("head").append($styles);

			var $modals = $page.children("#page-modals");
			$("body").append($modals);

			var $upsell = $page.children("#page-upsell");
				$upsell.attr("id", newPage + "-upsell");
				$upsell.addClass("upsell");
				$upsell.addClass("row");
				$upsell.attr("data-feature", newPage);
			var $content = $page.children("#page-content");
				$content.attr("id", newPage);
				$content.addClass("page");
				if (window.page.features.indexOf(newPage) == -1) {
					$content.append($upsell);
				}
			$(".pages").append($content);

			var $scripts = $page.children("#page-scripts");
			$("head").append($scripts);

			upsellTrigger();
			window.page.hideLoading();
			setPage(newPage); // and show it
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

window.page.getStaticPath = function() {
	return $("#staticPath").text();
};

window.page.showLoading = function() {
	if (window.page.loadTimeout || $(".loadOverlay").hasClass("showLoadOverlay")) {
		return;
	}
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
window.page.setColor = function(color) {
	var complements = {
		"#333333": "#222222",
		"#990f0f": "#880e0e",
		"#0f993b": "#0e882a",
		"#1c19c2": "#0b08b1",
		"#c93e3e": "#b82d2d",
		"#37c464": "#26b353",
		"#3834fa": "#2723e9",
		"#00c8d8": "#00b7c7"
	};

	var complement = complements[color];

	window.page.color = color;
	window.page.complement = complement;

	$(".tabs").css("background-color", color);
	$(".navbar-default").css("background-color", color);
	$("#page-pref-btn").css("background-color", color);
	$(".navbar-default .dropdown-menu").css("background-color", color);

	$(".tabs").css("border-right", "solid 1px " + complement);
	$("#page-pref-btn").css("border-color", complement);

	$.each(["#page-pref-btn", ".tabs li", ".navbar-default .navbar-nav>li>a", ".navbar-default .dropdown-menu>li>a", ".back-to-home"], function() {
		$(this.toString()).css("background-color", window.page.color).off("mouseenter").off("mouseleave").mouseenter(function() {
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
		desc = "Annoyed by something? Found a glitch? Hate how something works? Tell us! We'd love to help you and improve MyHomeworkSpace.";
	} else if (type == "idea") {
		desc = "Have an idea for a new feature? Something that helps you? A tweak to make your life easier? Tell us! We'd love to include it and make MyHomeworkSpace even better!";
	}

	$("#feedback-modal-title-first").text("Send a ");
	if (type == "idea") {
		$("#feedback-modal-title-first").text("Send an ");
	}
	$(".feedback-type").text(type);
	$(".feedback-desc").text(desc);

	$("#feedback-modal").modal();
};

function upsellTrigger() {
	$(".upsell-btn").off("click").on("click", function() {
		var feature = $(this).attr("data-feature");

		window.page.showLoading();

		window.page.addFeature(feature, function() {
			window.location.hash = feature;
			window.location.reload();
		});

		//$(".upsell[data-feature=" + feature + "]").remove();
	});
}

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

	$("#page-pref-btn").click(function() {
		window.prefs.openModal(window.page.getOpenPage());
	});

	upsellTrigger();

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

	// this is used by topTabs to move the prefs button
	$(".username-menu").on("show.bs.dropdown", function() {
		$("#page-pref-btn").addClass("moved");
	});
	$(".username-menu").on("hide.bs.dropdown", function() {
		$("#page-pref-btn").removeClass("moved");
	});

	window.api.ready(function() {
		console.log("Nonce pool ready!");

		window.prefs.getBatch(["topTabs", "themeColor"], function(prefs) {
			if (prefs.topTabs == "1") {
				$("head").append('<link href=" ' + $("#staticPath").text() + '/css/topTabs.css" rel="stylesheet" />');
			}

			if (prefs.themeColor != undefined && prefs.themeColor != "") {
				window.page.setColor(prefs.themeColor);
				$(".selBox.themeColor.selected").removeClass("selected");
				$(".selBox.themeColor[data-selBoxVal=" + prefs.themeColor + "]").addClass("selected");
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

			// these are exempt from enabling
			window.page.features.push("overview");
			window.page.features.push("admin");
			window.page.features.push("admin-feedback");
			window.page.features.push("admin-announcements");
			window.page.features.push("admin-stats");
			window.page.features.push("admin-about");
			window.page.features.push("admin-login");
			window.page.features.push("admin-users");

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

	window.api.init();
});
