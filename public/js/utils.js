window.utils = {};

window.utils.b64EncodeUnicode = function(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
};

window.utils.getLongNameForFeature = function(feature) {
	var features = {
		overview: "Overview",
		planner: "Planner",
		hwView: "Homework View",
		labs: "Labs",
		myDay: "My Day",
		admin: "Administrative panel",
		"admin-feedback": "Feedback",
		"admin-stats": "Statistics",
		"admin-login": "Test user accounts",
		"admin-about": "About server"
	};
	return features[feature];
};

window.utils.getMonthName = function(month) {
	var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	return months[month];
};

window.utils.getDayOfWeek = function(dow) {
	var dows = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
	return dows[dow];
};

window.utils.formatDate_api = function(dateObj) {
	var month = (dateObj.getMonth() + 1).toString();
	var date = dateObj.getDate().toString();
	if (month.length == 1) {
		month = "0" + month;
	}
	if (date.length == 1) {
		date = "0" + date;
	}
	return dateObj.getFullYear() + "-" + month + "-" + date;
};

window.utils.formatDate_pretty = function(dateObj) {
	return (dateObj.getMonth() + 1) + "/" + dateObj.getDate();
};

window.utils.formatDate_english = function(date) {
	return window.utils.getDayOfWeek(date.getDay()) + ", " + window.utils.getMonthName(date.getMonth()) + " " + date.getDate() + ", " + (date.getYear() + 1900);
};

window.utils.getPrefix = function(text) {
	return text.split(' ')[0].trim().substr(0, 12); // limit to 12 chars
};

window.utils.getPrefixes = function() {
	return [
		{
			color: "cal_hw",
			words: ["HW", "Read", "Reading"],
			tabSystem: true
		},
		{
			color: "cal_project",
			words: ["Project"],
			tabSystem: true
		},
		{
			color: "cal_paper",
			words: ["Report", "Essay", "Paper"],
			tabSystem: true
		},
		{
			color: "cal_quiz",
			words: ["Quiz"],
			tabSystem: true
		},
		{
			color: "cal_quiz",
			words: ["PopQuiz"],
			tabSystem: false
		},
		{
			color: "cal_test",
			words: ["Test", "Final", "Exam", "Midterm"],
			tabSystem: true
		},
		{
			color: "cal_ica",
			words: ["ICA"],
			tabSystem: true
		},
		{
			color: "cal_lab",
			words: ["Lab", "Study", "Memorize"],
			tabSystem: true
		},
		{
			color: "cal_docid",
			words: ["DocID"],
			tabSystem: true
		},
		{
			color: "cal_hex",
			words: ["Trojun", "Hex"],
			tabSystem: false
		},
		{
			color: "cal_no_hw",
			words: ["NoHW", "None"],
			tabSystem: true
		},
		{
			color: "cal_optional_hw",
			words: ["OptionalHW", "Challenge"],
			tabSystem: true

            color: "cal_prez",
            words: ["Presentation", "Prez"],
            tabSystem: true

		}
	]
}

window.utils.getPrefixClass = function(prefix) {
	var chkPrefix = prefix.toLowerCase();
	var prefixes = window.utils.getPrefixes();
	for (var prefixIndex in prefixes) {
		for (var wordIndex in prefixes[prefixIndex].words) {
			if (prefixes[prefixIndex].words[wordIndex].toLowerCase() == chkPrefix) {
				return prefixes[prefixIndex].color;
			}
		}
	}
	return "cal_no_prefix";
};

window.utils.getTabPrefixes = function() {
	var prefixes = window.utils.getPrefixes();
	var returnObj = [];

	for (var prefixIndex in prefixes) {
		var prefix = prefixes[prefixIndex];
		if (prefix.tabSystem) {
			returnObj.push(prefix);
		}
	}

	return returnObj;
}
