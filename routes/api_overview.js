var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/announcements/get/', global.apiCall, function(req, res, next) {
	knex("announcements").select("*").then(function(obj) {
		res.json({
			status: "ok",
			feedback: obj
		});
	}).catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error."
		});	
	});
});

router.get('/events/getDay/', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	knex("planner_events").where({
		userId: res.locals.user.id,
		date: req.body.day
	}).select("*").then(function(obj) {
		res.json({
			status: "ok",
			feedback: obj
		});
	}).catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error."
		});
	});
});
module.exports = router;
