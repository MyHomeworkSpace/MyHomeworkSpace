var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/fetchPage/:page', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.params.page === undefined) {
		res.json({
			status: "error",
			error: "Missing page parameter!"
		});
		return;
	}

	// "why do you do this? why not just pass user input into res.render?"
	// "path traversal"
	// TODO: make this better
	var pages = {
		"admin": "admin",
		"admin-about": "admin-about",
		"admin-login": "admin-login",
		"admin-stats": "admin-stats",
		"overview": "overview",
		"testPage": "testPage"
	};

	if (pages[req.params.page] === undefined) {
		res.json({
			status: "error",
			error: "Invalid page parameter!"
		});
		return;
	}

	var currentPage = pages[req.params.page];
	res.render("pages/" + currentPage);
});

module.exports = router;
