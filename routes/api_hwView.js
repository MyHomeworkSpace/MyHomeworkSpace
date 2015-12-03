var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/getHw/', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.query.date == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid date parameter!"
		});
		return;
	}
	knex("planner_events").select("*").where({
		userId: res.locals.user.id
	}).where("date", ">=", new Date(req.query.date)).where(knex.raw("WEEKDAY(date)"), "!=", 5).where(knex.raw("WEEKDAY(date)"), "!=", 6).then(function(data) {
		res.json({
			status: "ok",
			events: data
		});
	});
});

module.exports = router;