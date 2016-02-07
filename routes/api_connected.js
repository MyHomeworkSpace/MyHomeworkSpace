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
	var username = req.body.username;
	var password = req.body.password;

	var data = "";
	data += "<credentials><username>";
	data += username.encodeHTML();
	data += "</username><password type=\"plaintext\">";
	data += password.encodeHTML();
	data += "</password></credentials>";

	key, action, data, err, callback
	roux.request("", "authenticate", data, function(err) {
		res.json({
			status: "error",
			message: err
		});
	}, function(data) {
		var key = data["response"]["result"][0]["key"][0]["_"];
		var owner = data["response"]["result"][0]["key"][0]["$"]["owner"];

		roux.request(key, "selectObjects", "object><objecttype><name>academicyear</name></objecttype></object><pattern><sortorder><academicyear><open>desc</open></academicyear></sortorder><limit>1</limit></pattern>", function(err) {
			res.json({
				status: "error",
				message: err
			});
		}, function(data) {
			var academicyear = data["response"]["result"][0]["academicyear"][0]["$"]["SSID"];

			res.json({
				status: "ok",
				year: academicyear
			});
			return;

			var start = utils.findNextMonday();
			var end = new Date(start);
			end.setDate(end.getDate() + 4);

			rouxRequest = "";
			rouxRequest += "<request><key>";
			rouxRequest += key.encodeHTML();
			rouxRequest += "</key><action>selectStudentCalendar</action><ID>";
			rouxRequest += owner.encodeHTML();
			rouxRequest += "</ID><academicyear>";
			rouxRequest += academicyear;
			rouxRequest += "</academicyear><start>";
			rouxRequest += utils.formatDate_roux(start);
			rouxRequest += "</start><end>";
			rouxRequest += utils.formatDate_roux(end);
			rouxRequest += "</end></request>";

			roux.request(key, "selectStudentCalendar", data, function(err) {
				res.json({
					status: "error",
					message: err
				});
			}, function(data) {
				res.json({
					status: "ok",
					chunk: chunk,
					data: data
				});
			});
		});
	});


	var post_req = https.request(post_options, function(hRes) {
		hRes.setEncoding('utf8');
		hRes.on('data', function (chunk) {
			parseXmlString(chunk, function(err, data) {
				if (err) {
					res.json({err:err});
					return;
				}
				if (data["response"]["result"][0]["$"]["status"] != 200) {
					res.json({
						status: "ok",
						message: "The username or password was incorrect!"
					});
					return;
				}
				var key = data["response"]["result"][0]["key"][0]["_"];
				var owner = data["response"]["result"][0]["key"][0]["$"]["owner"];



				post_data = querystring.stringify({
					'rouxRequest': rouxRequest
				});
				post_options.headers["Content-Length"] = post_data.length;
				post_req = https.request(post_options, function(hUserRes) {
					hUserRes.setEncoding('utf8');
					hUserRes.on('data', function (chunk) {
						parseXmlString(chunk, function(err, data) {
							res.json({
								status: "ok",
								chunk: chunk,
								data: data
							});
						});
					});
				});

				post_req.write(post_data);
				post_req.end();
			});
		});
	});

	post_req.write(post_data);
	post_req.end();
});

module.exports = router;
