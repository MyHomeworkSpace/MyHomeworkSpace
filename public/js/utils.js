window.utils = {};

window.utils.b64EncodeUnicode = function(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
};

window.utils.getLongNameForFeature = function(feature) {
	switch (feature) {
		case "planner":
			return "Planner";

		case "hwView":
			return "Homework View";

		case "myDay":
			return "My Day";
	}
};

window.utils.getMonthName = function(month) {
	switch (month) {
		case 0:
			return "January";
		case 1:
			return "February";
		case 2:
			return "March";
		case 3:
			return "April";
		case 4:
			return "May";
		case 5:
			return "June";
		case 6:
			return "July";
		case 7:
			return "August";
		case 8:
			return "September";
		case 9:
			return "October";
		case 10:
			return "November";
		case 11:
			return "December";
		default:
			return "Unknown";
	}
};

window.utils.getDayOfWeek = function(dow) {
	switch (dow) {
		case 0:
			return "Sunday";
		case 1:
			return "Monday";
		case 2:
			return "Tuesday";
		case 3:
			return "Wednesday";
		case 4:
			return "Thursday";
		case 5:
			return "Friday";
		case 6:
			return "Saturday";
		default:
			return "Unknown";
	}
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

window.utils.getPrefixClass = function(prefix) {
	switch (prefix.toLowerCase()) {
		case "hw":
		case "read":
		case "reading":
			return "cal_hw";

		case "project":
			return "cal_project";

		case "report":
		case "essay":
		case "paper":
			return "cal_paper";
		
		case "popquiz":
		case "quiz":
			return "cal_quiz";

		case "test":
		case "final":
		case "exam":
		case "midterm":
			return "cal_test";

		case "ica":
			return "cal_ica";

		case "lab":
		case "study":
			return "cal_lab";

		case "docid":
			return "cal_docid";

		case "trojun":
		case "hex":
			return "cal_hex";

		default:
			return "cal_no_prefix";
	}
};
