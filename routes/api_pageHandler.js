var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/fetchPage', function(req, res, next) {
	res.json({
		status: "ok",
		page: ""
	});
});

module.exports = router;
