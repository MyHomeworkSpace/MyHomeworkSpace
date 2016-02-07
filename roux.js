var parseXmlString = require('xml2js').parseString;
var https = require('https');
var querystring = require('querystring');

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
				if (err || !data) {
					errCallback("Unknown error.", err);
					return;
				}
				if (data["response"]["result"][0]["$"]["status"] != 200) {
					errCallback("The username or password was incorrect!", err);
					return;
				}
				callback(data, chunk);
			});
		});
	});

	post_req.write(post_data);
	post_req.end();
};

module.exports = roux;
