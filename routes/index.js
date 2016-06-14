var express = require('express');
var router = express.Router();
var request = require("request");

var querystring = require('querystring');
var https = require('https');
var parseXmlString = require('xml2js').parseString;

/* GET home page. */
router.get('/', global.getOptionalUserRecord, function(req, res, next) {
	res.render('index', { title: 'MyHomeworkSpace' });
});

router.get('/typer', global.getOptionalUserRecord, function(req, res, next) {
	res.render('typer', { title: 'PlannerTyper' })
});

router.get('/privacy', global.getOptionalUserRecord, function(req, res, next) {
	res.render('privacy', { title: 'Privacy Policy' })
});

router.get("/error", global.getOptionalUserRecord, function(req, res, next) {
	var err = new Error('Yay an error');
	err.status = 500;
	next(err);
});

router.get('/about', global.getOptionalUserRecord, function(req, res, next) {
	res.render('about', { title: 'About' });
});

router.get('/staging', global.getOptionalUserRecord, function(req, res, next) {
	res.render('staging', { title: 'Staging' });
});

/*router.get('/emailTest', global.getOptionalUserRecord, function(req, res, next) {
	require("../emails.js").sendEmail("verify", "astuder@myhomework.space", { verify_url: "https://myhomework.space/lel" }, function() {
		res.end("yay");
	}, function() {
		res.end("errez!");
	});
});*/

router.get('/logout', global.requireUser, function(req, res, next) {
	req.session.loggedIn = false;
	req.session.username = "logged out";
	req.session.destroy();
	res.redirect(global.basePath + "/");
});

router.get('/login', global.getOptionalUserRecord, function(req, res, next) {
	res.render('login', { title: 'Log in' });
});

router.post('/login', global.getOptionalUserRecord, function(req, res, next) {
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
		return;
	}
	if (req.body.username == "zomg_testTeacher" && req.body.password == "hexrSecret!") {
		// activate testing teacher
		req.session.loggedIn = true;
		req.session.username = "zomg_testTeacher";
		res.redirect(global.basePath + "/app");
		return;
	}
	/*if (!(req.body.username == "c19as3" || req.body.username == "c19ww" || req.body.username == "c19em" || req.body.username == "c19jf" || req.body.username == "c20wb" || req.body.username == "c21ys" || req.body.username == "c21as2" || req.body.username == "c21lw")) {
		res.render('login', { title: 'Log in', error: 'You do not have permission to access this site.' });
		return;
	}*/
	username = req.body.username.split("\\")[0];
	password = req.body.password;

	var jar = request.jar();
	request.post("https://hsregistration.dalton.org/src/server/index.phplogin", {jar: jar, headers: { "Referer": "https://hsregistration.dalton.org/", "Origin": "https://hsregistration.dalton.org", "User-Agent": "Mozilla/5.0 (X11; CrOS x86_64 7978.74.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.103 Safari/537.36" }, form: { "username": username, "password": password } }, function(err, resp, body) {
		if (err) {
			res.json({err: err});
			return;
		}
		var data = JSON.parse(body);
		if (!data["logged_in"]) {
			// TODO: Check for errors that aren't "invalid credentials"
			// TODO: how does hsregistration handle these?
			res.render('login', { title: 'Log in', error: 'The username or password was incorrect.' });
			return;
		}

		// username is defined
		var email = username + "@dalton.org"; // guess the email!
		var user_type = data["roles"][0];
		var name = data["fullname"];

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

module.exports = router;
