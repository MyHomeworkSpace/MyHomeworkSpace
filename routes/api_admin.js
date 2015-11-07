var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/feedback/getList', global.apiCall, global.requireUser, global.getUserRecord, global.requireViewFeedback, function(req, res, next) {
	knex("feedback").select("feedbackId", "msg", "name", "type").then(function(obj) {
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

router.get('/feedback/get/:id', global.apiCall, global.requireUser, global.getUserRecord, global.requireViewFeedback, function(req, res, next) {
	knex("feedback").where({
		feedbackId: req.params.id
	}).select("*").then(function(obj) {
		res.json({
			status: "ok",
			feedback: obj[0]
		});
	}).catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error."
		});	
	});
});

module.exports = router;
