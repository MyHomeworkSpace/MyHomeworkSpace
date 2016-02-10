var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/fetchPage', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.params.page === undefined) {
		res.json({
			status: "error",
			error: "Missing page parameter!"
		});
		return;
	}

	// "why do you do this? why not just pass user input into res.render?"
	// "path traversal"
	var pages = {
		"testPage": "testPage"
	};

	if (pages.indexOf(req.params.page) == -1) {
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
