window.admin = {};

$(document).ready(function() {
	$("#admin-feedback").on("tabOpened", function() {
		window.api.get("admin/feedback/getList", function(resp) {
			$("#admin-feedback-list").text("");
			for (var feedbackIndex in resp.feedback) {
				var feedbackItem = resp.feedback[feedbackIndex];
				var $feedbackLi = $('<li></li>');
					var $feedbackDesc = $('<div></div>');
						$feedbackDesc.text(" #" + feedbackItem.feedbackId + " " + feedbackItem.msg);
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
						$feedbackName.text(feedbackItem.name + " (" + feedbackItem.username + ")");
					$feedbackLi.append($feedbackName);
					var $feedbackDay = $('<div><em></em></div>');
						$feedbackDay.children("em").text("Sent " + moment(feedbackItem.timestamp).format("MM/DD/YY"));
					$feedbackLi.append($feedbackDay);
					$feedbackLi.attr("data-webpage", feedbackItem.webpage)
					$feedbackLi.click(function() {
						var iframeSrc = "";
						if ($(this).attr("data-webpage")) {
							iframeSrc = "<jqueryIsDumb>" + atob($(this).attr("data-webpage")) + "</jqueryIsDumb>";
							var $iframeSrc = $(iframeSrc);
							$iframeSrc.find("#feedback-modal").remove();
							$iframeSrc.find(".modal-backdrop").remove();
							$iframeSrc.find("link[rel=stylesheet]").each(function() {
								var oldUrl = $(this).attr("href");
								if (oldUrl) {
									if (oldUrl[0] == "/") {
										// it is a relative path
										var newUrl = window.location.protocol + "//" + window.location.host + oldUrl; // make it absolute
										$(this).attr("href", newUrl);
									}
								}
							});
							iframeSrc = $iframeSrc.html().toString();
						} else {
							iframeSrc = "<em>No screenshot data was included with this submission.</em>";
						}
						$("#admin-feedback-modal").find("iframe").attr("src", "data:text/html," + iframeSrc);
						if ($(this).attr("data-webpage")) {

						}
						$("#admin-feedback-modal").modal();
					});
				$("#admin-feedback-list").append($feedbackLi);
			};
		});
	});
	window.api.get('overview/announcements/get/', function(data) {
		var response = data.feedback;
		for(feed in response) {
			var $feedLi = $("<li></li>");
				$feedLi.append(response[feed].msg);
				if(!moment(response[feed].time).add(response[feed].days, "days").isAfter(moment())) {
					$feedLi.append(" <em>(expired)</em>");
				}
				$feedLi.attr("data-id", response[feed].announcementId);
				var $copyLi = $feedLi.clone();
					var $days = $('<strong></strong>');
						$days.text(" Days: " + response[feed].days + ", Poster ID: " + response[feed].posterId);
					$copyLi.append($days)
				$("#adminAnnouncementList").append($copyLi);
				var $removeBtn = $('<button class="btn btn-xs btn-danger"> <i class="fa fa-trash-o"></i> </button>');
					$removeBtn.click(function() {
						var idThingy = $(this).parent().attr("data-id");
						$(this).parent().addClass("announcementDelete");
						$(this).remove();
						window.api.post('admin/announcements/remove', {id: idThingy}, function(result){});
					});
				$feedLi.append($removeBtn)
			$("#announcement-delete-list").append($feedLi);

		}
		if($("#adminAnnouncementList").children().size() > 1) {
			$("#adminNoAnnouncements").remove()
		}
	});
	$("#announcement-submit").click(function() {
		if($("#announcement-msg").val().length != 0 && $("#announcement-days").val() > 0) {
			var postMe = {};
			postMe.days = $("#announcement-days").val();
			postMe.time = window.utils.formatDate_api(moment().toDate());
			postMe.msg = $("#announcement-msg").val();
			window.api.post('admin/announcements/post/', postMe, function(result){
				swal("Yay", "Your announcement has been posted", "success");
			});
		}
	});
	$("#announcement-clear").click(function() {
		$("#admin-announcement-modal").modal();
	});
	window.api.get('admin/users/count/', function(result) {
		$("#userNumber").text("There are " + result.number + " users!")
	});
	window.api.get('admin/users/get/', function(result) {
		for (var userIndex in result.users) {
			var user = result.users[userIndex];
			console.log(user);
		}
	});
});
