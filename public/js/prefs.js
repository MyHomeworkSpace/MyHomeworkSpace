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

window.prefs.getBatch = function(names, callback) {
	window.api.post("prefs/getBatch/", { names: names }, function(data) {
		var vals = {};
		for (var dataIndex in data) {
			vals[data[dataIndex].name] = data[dataIndex].value;
		}
		callback(vals);
	});
};

window.prefs.set = function(name, val, callback) {
	window.api.post("prefs/set", { name: name, value: val}, function() {
		callback();
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

window.api.ready(function() {
	$("#prefs-done").click(function() {
		$("#prefs-modal").modal("hide");
		setPage($("#prefs-modal").attr("data-feature"));
	});
	$("#titles-new").click(function() {
		var $liThingy = $('<li class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span></li>');
			$liThingy.attr("id", "title");
			var $inputBox = $('<input></input>')
				$inputBox.val("title");
				$inputBox.change(function(){
					$(this).parent().attr("id", $(this).val());
					var setList = JSON.stringify($("#title-sorting").sortable("toArray"));
					window.api.post("prefs/set", {name: "titleOrder", value:setList}, function() {});
				});
			$liThingy.append($inputBox);
			var $deleteButton = $('<button class="btn btn-xs btn-danger"><i class="fa fa-trash-o"></i></button>')
				$deleteButton.click(function() {
					$(this).parent().remove();
					var setList = JSON.stringify($("#title-sorting").sortable("toArray"));
					window.api.post("prefs/set", {name: "titleOrder", value:setList}, function() {});
				});
			$liThingy.append($deleteButton);
		$("#title-sorting").append($liThingy)
	});
	window.prefs.getJSONPref("titleOrder", function(val) {
		if(val == undefined) {
			val = ["HW","Read","Reading","Project","Report","Essay","Paper","Quiz","Test","Final","Exam","Midterm","Lab","Study","DocID","None","NoHW","subjectName"]
		}
		for(title in val) {
			var $titleLi = $('<li class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span></li>');
				$titleLi.attr("id", val[title]);
				var $titleWord = $('<input></input>');
					$titleWord.val(val[title]);
					$titleWord.change(function() {
						$(this).parent().attr("id", $(this).val());
						var setList = JSON.stringify($("#title-sorting").sortable("toArray"));
						window.api.post("prefs/set", {name: "titleOrder", value:setList}, function() {});
					});
				$titleLi.append($titleWord);
				var $deleteThem = $('<button class="btn btn-xs btn-danger"><i class="fa fa-trash-o"></i></button>');
					$deleteThem.click(function() {
						$(this).parent().remove();
						var setList = JSON.stringify($("#title-sorting").sortable("toArray"));
						window.api.post("prefs/set", {name: "titleOrder", value:setList}, function() {});
					});
				$titleLi.append($deleteThem);
			$("#title-sorting").append($titleLi);
		};
		$("#title-sorting").sortable({
			stop: function (event, ui) {
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

	// Layout
	window.prefs.checkToggle($("#prefs-layout-topTabs"), "topTabs");
	window.prefs.checkToggle($("#prefs-layout-hideTawk"), "hideTawk");
	$(".selBox.themeColor").each(function() {
		$(this).css("background-color", $(this).attr("data-selBoxVal"));
	});

	$(".themeColor").on("selBoxChanged", function(e) {
		window.page.setColor(e.to);
		window.prefs.set("themeColor", e.to, function() {

		});
	});

	// Connected accounts
	$("#schedules-connect").click(function() {
		$("#login-to-schedules-modal").modal();
	});

	$("#schedules-sign-in").click(function() {
		window.api.post("connected/schedules/connect", { username: $("#schedules-username").val(), password: $("#schedules-pw").val() }, function(resp) {
			console.log(resp);
		});
	})

	// selboxes
	$(".selBox").click(function() {
		if ($(this).hasClass("selected") && !$(this).hasClass("custom")) {
			// Do nothing
			return;
		}
		console.log($("[data-selBoxGroup=" + $(this).attr("data-selBoxGroup") +"]"));
		$("[data-selBoxGroup=" + $(this).attr("data-selBoxGroup") +"]").removeClass("selected");
		$(this).addClass("selected");
		$(this).trigger({
			type: "selBoxChanged",
			to: $(this).attr("data-selBoxVal")
		});
	});
});
