window.admin = {};

$(document).ready(function() {
	$("#admin-feedback").on("tabOpened", function() {
		window.api.get("admin/feedback/getList", function(resp) {
			$("#admin-feedback-list").text("");
			for (var feedbackIndex in resp.feedback) {
				var feedbackItem = resp.feedback[feedbackIndex];
				var $feedbackLi = $('<li></li>');
					$feedbackLi.text(feedbackItem.name);
				$("#admin-feedback-list").append($feedbackLi);
			};
		});
	});
});
