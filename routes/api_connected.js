var express = require('express');
var router = express.Router();

var parseXmlString = require('xml2js').parseString;
var https = require('https');
var querystring = require('querystring');

var utils = require('../utils');
var roux = require('../roux');

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.post('/schedules/connect', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.body.username == undefined || req.body.password == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid user credentials!"
		});
		return;
	}

	knex.select("*").from("schedule").where({
		userId: res.locals.user.id
	}).then(function(data) {
		if (data.length != 0) {
			res.json({
				status: "error",
				error: "You've already imported your schedule!",
				hex: data
			});
			return;
		}
		var username = req.body.username;
		var password = req.body.password;

		var dataStr = "";
		dataStr += "<credentials><username>";
		dataStr += username.encodeHTML();
		dataStr += "</username><password type=\"plaintext\">";
		dataStr += password.encodeHTML();
		dataStr += "</password></credentials>";

		roux.request("", "authenticate", dataStr, function(err) {
			res.json({
				status: "error",
				message: err
			});
		}, function(data) {
			var key = data["response"]["result"][0]["key"][0]["_"];
			var owner = data["response"]["result"][0]["key"][0]["$"]["owner"];

			roux.request(key, "selectObjects", "<object><objecttype><name>academicyear</name></objecttype></object><pattern><sortorder><academicyear><open>desc</open></academicyear></sortorder><limit>1</limit></pattern>", function(msg, err) {
				res.json({
					status: "error",
					message: msg,
					err: err
				});
			}, function(data) {
				var academicyear = data["response"]["result"][0]["academicyear"][0]["$"]["SSID"];

				var start = utils.findNextMonday();
				var end = new Date(start);
				end.setDate(end.getDate() + 4);

				dataStr = "";
				dataStr += "<request><key>";
				dataStr += key.encodeHTML();
				dataStr += "</key><action>selectStudentCalendar</action><ID>";
				dataStr += owner.encodeHTML();
				dataStr += "</ID><academicyear>";
				dataStr += academicyear;
				dataStr += "</academicyear><start>";
				dataStr += utils.formatDate_roux(start);
				dataStr += "</start><end>";
				dataStr += utils.formatDate_roux(end);
				dataStr += "</end></request>";

				roux.request(key, "selectStudentCalendar", dataStr, function(msg, err) {
					res.json({
						status: "error",
						message: msg,
						err: err
					});
					return;
				}, function(data, chunk) {
					var periods = data.response.result[0].period;
					var knexedPeriods = [];
					for (var periodIndex in periods) {
						var period = { userId: res.locals.user.id };
						period.period = periods[periodIndex].BLOCK_NAME[0];
						period.courseName = periods[periodIndex].section[0].name[0];
						period.courseShortName = periods[periodIndex].section[0].shortname[0];
						period.teacherName = periods[periodIndex].instructor[0].name[0];
					}
					res.json({
						status: "ok",
						data: data,
						knexedPeriods: knexedPeriods
					});
				});
			});
		});
	});
});

module.exports = router;
