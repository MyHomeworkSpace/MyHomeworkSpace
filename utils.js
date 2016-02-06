var utils = {};

utils.findThisMonday = function() {
	var today = new Date();
	while (today.getDay() != 1) { // loop until a monday is found
		today.setDate(today.getDate() - 1);
	}
	return today;
};

utils.formatDate_roux = function(dateObj) {
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

module.exports = utils;
