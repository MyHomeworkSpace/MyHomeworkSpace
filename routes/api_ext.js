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
		authPage: "https://myhomework.space/api/v1/ext/appAuth/" + "asdf"
	});
});

router.get("/appAuth/:token", function(req, res, next) {
	res.render("externalapp", { title: 'PlanHub', appName: "DaltonTab" });
});

module.exports = router;
