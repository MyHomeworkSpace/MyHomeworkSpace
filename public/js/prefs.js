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

window.prefs.btn = function(name, id) {
	window.prefs.get(name, function(val) {
		var btnTrue = val;
		if(btnTrue == "1") {
			$("#" + id).prop("checked", true);
		}
		$("#" + id).change(function() {
			if(btnTrue == "1") {
				btnTrue = "0";
			} else {
				btnTrue = "1";
			}
			window.api.post("prefs/set", { name: name, value: btnTrue}, function() {});
		});
	});
};

$(document).ready(function() {
	$("#prefs-done").click(function() {
		$("#prefs-modal").modal("hide");
		setPage($("#prefs-modal").attr("data-feature"));
	});
	window.prefs.get("name-subj", function(val) {
		var btnTrue = val;
		if(btnTrue == "1") {
			$("#prefs-hwView-swap").prop("checked", true);
		}
		$("#prefs-hwView-swap").change(function() {
			if(btnTrue == "1") {
				btnTrue = "0";
			} else {
				btnTrue = "1";
			};
			window.api.post("prefs/set", { name: "name-subj", value: btnTrue}, function() {});
		});
		
	});
	$("#usr-btn").click(function() {
		var usrname = $("#usr-name").val();
		window.api.post("prefs/setName", { name: usrname }, function() {
			window.page.showLoading();
			window.location.reload();
		});
	});
});
