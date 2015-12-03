var express = require('express');
var router = express.Router();

var querystring = require('querystring');
var https = require('https');
var parseXmlString = require('xml2js').parseString;

/* GET home page. */
router.get('/', global.getOptionalUserRecord, function(req, res, next) {
	res.render('index', { title: 'PlanHub' });
});

router.get('/about', global.getOptionalUserRecord, function(req, res, next) {
	res.render('about', { title: 'About' });
});

router.get('/logout', global.requireUser, function(req, res, next) {
	req.session.loggedIn = false;
	req.session.username = "logged out";
	req.session.destroy();
	res.redirect(global.basePath + "/");
});

router.get('/login', function(req, res, next) {
	res.render('login', { title: 'Log in' });
});

router.post('/login', function(req, res, next) {
	var username = "";
	var password = "";

	if (!req.body.username) {
		res.render('login', { title: 'Log in', error: 'Username is required.' });
		return;
	}
	if (!req.body.password) {
		res.render('login', { title: 'Log in', error: 'Password is required.' });
		return;
	}
	if (req.body.username == "zomg_testUser" && req.body.password == "superSecret!") {
		// activate testing user
		req.session.loggedIn = true;
		req.session.username = "zomg_testUser";
		res.redirect(global.basePath + "/app");
	}
	/*if (!(req.body.username == "c19as3" || req.body.username == "c19ww" || req.body.username == "c19em" || req.body.username == "c19jf" || req.body.username == "c20wb" || req.body.username == "c21ys" || req.body.username == "c21as2" || req.body.username == "c21lw")) {
		res.render('login', { title: 'Log in', error: 'You do not have permission to access this site.' });
		return;
	}*/
	username = req.body.username;
	password = req.body.password;

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
					// TODO: Check for errors that aren't "invalid credentials"
					res.render('login', { title: 'Log in', error: 'The username or password was incorrect.' });
					return;
				}
				var key = data["response"]["result"][0]["key"][0]["_"];
				var owner = data["response"]["result"][0]["key"][0]["$"]["owner"];

				rouxRequest = "";
				rouxRequest += "<request><key>";
				rouxRequest += key.encodeHTML();
				rouxRequest += "</key><action>selectUser</action><ID>";
				rouxRequest += owner.encodeHTML();
				rouxRequest += "</ID></request>";

				post_data = querystring.stringify({
					'rouxRequest': rouxRequest
				});
				post_options.headers["Content-Length"] = post_data.length;
				post_req = https.request(post_options, function(hUserRes) {
					hUserRes.setEncoding('utf8');
					hUserRes.on('data', function (chunk) {
						parseXmlString(chunk, function(err, data) {
							// username is defined
							var email = username + "@dalton.org"; // guess the email!
							var user_type = data["response"]["result"][0]["user"][0]["$"]["type"];
							var name = data["response"]["result"][0]["user"][0]["name"][0];
							
							knex.select('*').from('users').limit(1).where({
								username: username
							}).then(function(obj) {
								if (obj.length == 0) {
									// not created
									// insert it
									knex("users").insert({
										name: name,
										username: username,
										email: email,
										type: user_type
									}).then(function() {
										req.session.loggedIn = true;
										req.session.username = username;
										res.redirect(global.basePath + "/app");
									}).catch(function(e) {
										res.render("error", { title: "Error", msg: "There was an unexpected database error. Please try again later.", error: e }); // give up
										return;
									});
								} else {
									// not created, just sign them in.
									req.session.loggedIn = true;
									req.session.username = username;
									res.redirect(global.basePath + "/app");
								}
							}).catch(function(e) {
								res.render("error", { title: "Error", msg: "There was an unexpected database error. Please try again later." }); // give up
								return;
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
