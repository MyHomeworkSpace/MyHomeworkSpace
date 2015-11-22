var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/getAuthPage', global.apiCall, function(req, res, next) {
	res.json({
		status: "ok",
		authPage: "https://planhub.me/api/v1/ext/appAuth/" + "asdf"
	});
});

router.get("/appAuth/:token", function(req, res, next) {
	res.render("externalapp");
});

module.exports = router;
