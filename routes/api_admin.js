var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/feedback/get/:id', global.apiCall, global.requireUser, global.getUserRecord, global.requireFeedbackView, function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

module.exports = router;