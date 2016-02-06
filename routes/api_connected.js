var express = require('express');
var router = express.Router();

var parseXmlString = require('xml2js').parseString;
var https = require('https');
var querystring = require('querystring');

var utils = require('../utils');

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.post('/schedules/connect', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	var rouxRequest = "";
	rouxRequest += "<request><key></key><action>authenticate</action><credentials><username>";
	rouxRequest += username.encodeHTML();
	rouxRequest += "</username><password type=\"plaintext\">";
	rouxRequest += password.encodeHTML();
	rouxRequest += "</password></credentials></request>";

	var post_data = querystring.stringify({
		'rouxRequest': rouxRequest
	});

	var post_options = {
		host: 'schedules.dalton.org',
		port: '443',
		path: '/roux/index.php',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': post_data.length
		}
	};

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

				var start = utils.findThisMonday();
				var end = new Date(start);
				end.setDate(end.getDate() + 4);

				rouxRequest = "";
				rouxRequest += "<request><key>";
				rouxRequest += key.encodeHTML();
				rouxRequest += "</key><action>selectStudentCalendar</action><ID>";
				rouxRequest += owner.encodeHTML();
				rouxRequest += "</ID><start>";
				rouxRequest += utils.formatDate_roux(start);
				rouxRequest += "</start><end>";
				rouxRequest += utils.formatDate_roux(end);
				rouxRequest += "</end></request>";

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
