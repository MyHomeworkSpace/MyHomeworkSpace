window.prefs = {};

window.prefs.openModal = function(feature) {
	$("#prefs-feature-name").text(window.utils.getLongNameForFeature(feature));
	$(".prefs-modal-body").addClass("hidden");
	$("#prefs-" + feature + "-body").removeClass("hidden");
	$("#prefs-modal").attr("data-feature", feature);
	$("#prefs-modal").modal({
		backdrop: "static",
		keyboard: false
	});
};

window.prefs.get = function(name, callback) {
	window.api.get("prefs/get/" + name, function(data) {
		callback(data.val);
	});
};

window.prefs.checkToggle = function($checkbox, prefsId) {
	window.prefs.get(prefsId, function(result) {
		var toggled = false;
		if (parseInt(result) == 1) {
			toggled = true;
		}
		$checkbox.prop("checked", toggled);
		$checkbox.change(function() {
			var prefsVal = ($(this).prop("checked") ? "1" : "0");	
			window.api.post("prefs/set", { name: prefsId, value: prefsVal}, function() {});
		});
	});
};
window.prefs.getJSONPref = function(name, callback) {
    window.prefs.get(name, function(val) {
    	if (val === undefined) {
    		callback(undefined);
    		return;
    	}
        callback(JSON.parse(val));
    });
};
$(document).ready(function() {
	$("#prefs-done").click(function() {
		$("#prefs-modal").modal("hide");
		setPage($("#prefs-modal").attr("data-feature"));
	});
	$("#usr-btn").click(function() {
		var usrname = $("#usr-name").val();
		window.api.post("prefs/setName", { name: usrname }, function() {
			window.page.showLoading();
			window.location.reload();
		});
	});
	window.prefs.getJSONPref("titleOrder", function(val) {
		if(val == undefined) {
			val = ["HW","Read","Reading","Project","Report","Essay","Paper","Quiz","Test","Final","Exam","Midterm","Lab","Study","DocID","None","NoHW","subjectName"]
		}
		for(title in val) {
			var $titleLi = $('<li class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span></li>');
				$titleLi.attr("id", val[title]);
				var $titleWord = $('<span></span>');
					$titleWord.text(val[title]);
				$titleLi.append($titleWord);
			$("#title-sorting").append($titleLi);
		};
		$("#title-sorting").sortable({
			over: function (event, ui) {
				var setList = JSON.stringify($("#title-sorting").sortable("toArray"));
				window.api.post("prefs/set", {name: "titleOrder", value:setList}, function() {});
			}
		});
		$("#title-sorting").disableSelection();
	});
	// Homework View
	window.prefs.checkToggle($("#prefs-hwView-swap"), "name-subj");
	window.prefs.checkToggle($("#prefs-hwView-color"), "titleclr");
	window.prefs.checkToggle($("#prefs-hwView-checkboxes"), "hwView-checkboxes");
});
