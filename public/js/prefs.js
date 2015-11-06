window.prefs = {};

window.prefs.openModal = function(feature) {
	$("#prefs-feature-name").text(window.utils.getLongNameForFeature(feature));
	$("#prefs-modal").modal();
};

$(document).ready(function() {
	window.api.get("prefs/get/name-subj", function(data) {
		var btnTrue = data.val;
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
