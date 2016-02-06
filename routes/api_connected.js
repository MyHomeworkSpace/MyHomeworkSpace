var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/schedules/connect', global.apiCall, function(req, res, next) {
	res.json({
		status: "ok"
	});
});

module.exports = router;
