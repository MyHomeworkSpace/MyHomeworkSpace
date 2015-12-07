window.admin = {};

$(document).ready(function() {
	$("#admin-feedback").on("tabOpened", function() {
		window.api.get("admin/feedback/getList", function(resp) {
			$("#admin-feedback-list").text("");
			for (var feedbackIndex in resp.feedback) {
				var feedbackItem = resp.feedback[feedbackIndex];
				var $feedbackLi = $('<li></li>');
					var $feedbackDesc = $('<div></div>');
						$feedbackDesc.text(" " + feedbackItem.msg;
						var $icon = $('<i class="fa"></i>');
							if (feedbackItem.type == "smile") {
								$icon.addClass("fa-smile-o");
							} else if (feedbackItem.type == "frown") {
								$icon.addClass("fa-frown-o");
							} else if (feedbackItem.type == "idea") {
								$icon.addClass("fa-lightbulb-o");
							}
						$feedbackDesc.prepend($icon);
					$feedbackLi.append($feedbackDesc);
					var $feedbackName = $('<div></div>');
						$feedbackName.text(feedbackItem.name);
					$feedbackLi.append($feedbackName);
				$("#admin-feedback-list").append($feedbackLi);
			};
		});
	});
});
