var parseXmlString = require('xml2js').parseString;
var https = require('https');
var querystring = require('querystring');
var request = require('request');

var roux = {};

roux.request = function(key, action, data, errCallback, callback) {
	var rouxRequest = "";
	rouxRequest += "<request><key>";
	rouxRequest += key;
	rouxRequest += "</key><action>";
	rouxRequest += action;
	rouxRequest += "</action>";
	rouxRequest += data;
	rouxRequest += "</request>";

	request.post("https://schedules.dalton.org/roux/index.php", {form: { rouxRequest: rouxRequest } }, function(err, resp, body) {
		parseXmlString(body, function(err, data) {
			if (err || !data) {
				console.log(error);
				errCallback("Unknown error.", err);
				return;
			}
			if (data["response"]["result"][0]["$"]["status"] != 200) {
				errCallback("The username or password was incorrect!", err);
				return;
			}
			callback(data, body);
		});
	});
};

module.exports = roux;
