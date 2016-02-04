var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/users/get', global.apiCall, global.requireUser, global.getUserRecord, global.requireNonZeroLevel, function(req, res, next) {
	knex("users").select("*").then(function(obj) {
		res.json({
			status: "ok",
			users: obj
		});
	}).catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error."
		});	
	});
});

router.get('/feedback/getList', global.apiCall, global.requireUser, global.getUserRecord, global.requireViewFeedback, function(req, res, next) {
	knex("feedback").select("feedbackId", "msg", "name", "type", "timestamp", "username", "webpage").then(function(obj) {
		var tempArr = obj;
		tempArr.reverse();
		res.json({
			status: "ok",
			feedback: tempArr
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

router.get('/errors/getList', global.apiCall, global.requireUser, global.getUserRecord, global.requireViewFeedback, function(req, res, next) {
	knex("errors").select("*").then(function(obj) {
		var tempArr = obj;
		tempArr.reverse();
		res.json({
			status: "ok",
			error: tempArr
		});	
	}).catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error."
		});	
	});
});

router.get('/errors/get/:id', global.apiCall, global.requireUser, global.getUserRecord, global.requireViewFeedback, function(req, res, next) {
	knex("errors").where({
		errorId: req.params.id
	}).select("*").then(function(obj) {
		res.json({
			status: "ok",
			error: obj[0]
		});
	}).catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error."
		});	
	});
});

router.post('/announcements/post/', global.apiCall, global.requireUser, global.getUserRecord, global.requireNonZeroLevel, function(req, res, next) {
	knex("announcements").insert({
		days: req.body.days,
		time: req.body.time,
		msg: req.body.msg,
		posterId: res.locals.user.id
	}).then(function() {
		res.json({
			status: "ok"
		});
	}).catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error"
		});
	});
});

router.post('/announcements/remove/', global.apiCall, global.requireUser, global.getUserRecord, global.requireNonZeroLevel, function(req, res, next) {
	knex("announcements").where({
		announcementId:req.body.id
	}).delete("*").then(function() {
		res.json({
			status: "ok"
		});
	}).catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error"
		});
	});
});

router.get('/users/count/', global.apiCall, global.requireUser, global.getUserRecord, global.requireNonZeroLevel, function(req, res, next) {
	knex("users").count('id as CNT').then(function(result) {
		res.json({
			status: "ok",
			number: result[0].CNT
		});
	}).catch(function(err) {
		res.json({
			status: "error",
			error: "Unknown database error"
		});
	});
});

module.exports = router;
