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
		myDay: "My Day",
		admin: "Administrative panel",
		"admin-feedback": "Feedback",
		"admin-stats": "Feedback",
		"admin-about": "Feedback"
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
			words: ["hw", "read", "reading"],
			tabSystem: true
		},
		{
			color: "cal_project",
			words: ["project"],
			tabSystem: true
		},
		{
			color: "cal_paper",
			words: ["report", "essay", "paper"],
			tabSystem: true
		},
		{
			color: "cal_quiz",
			words: ["quiz"],
			tabSystem: true
		},
		{
			color: "cal_quiz",
			words: ["popquiz"],
			tabSystem: false
		},
		{
			color: "cal_test",
			words: ["test", "final", "exam", "midterm"],
			tabSystem: true
		},
		{
			color: "cal_ica",
			words: ["ica"],
			tabSystem: true
		},
		{
			color: "cal_lab",
			words: ["lab", "study", "memorize"],
			tabSystem: true
		},
		{
			color: "cal_docid",
			words: ["docid"],
			tabSystem: true
		},
		{
			color: "cal_hex",
			words: ["trojun", "hex"],
			tabSystem: false
		},
		{
			color: "cal_no_hw",
			words: ["nohw", "none"],
			tabSystem: true
		},
		{
			color: "cal_optional_hw",
			words: ["optionalhw", "challenge"],
			tabSystem: true
			
		}
};

window.utils.getPrefixClass = function(prefix) {
	var chkPrefix = prefix.toLowerCase();
	var prefixes = window.utils.getPrefixes();
	for (var prefixIndex in prefixes) {
		if (prefixes[prefixIndex].indexOf(chkPrefix) > -1) {
			return prefixes[prefixIndex].color;
		}
	}
	return "cal_no_prefix";
};
