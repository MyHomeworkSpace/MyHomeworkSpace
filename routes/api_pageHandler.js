var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/fetchPage', function(req, res, next) {
	res.render(req.params.page);
});

module.exports = router;
