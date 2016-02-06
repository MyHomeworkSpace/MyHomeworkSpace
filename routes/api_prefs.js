var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/get/:name', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	knex("prefs").select("*").where({
		name: req.params.name,
		userId: res.locals.user.id
	}).then(function(obj) {
		if (obj.length === 0) {
			res.json({
				status: "ok",
				name: req.params.name,
				val: undefined
			});	
		}
		res.json({
			status: "ok",
			name: req.params.name,
			val: obj[0].value
		});
	}).catch(function(e) {
		res.json({
			status: "error",
			error: "Unknown database error"
		});
	});
});

router.post('/set/', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.body.name == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid name parameter."
		});
		return;
	}
	if (req.body.value == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid value parameter."
		});
		return;
	}

	knex("prefs").where({
		name: req.body.name,
		userId: res.locals.user.id
	}).select("*").then(function(obj) {
		if (obj.length == 0){
			knex("prefs").insert({
				name: req.body.name,
				value: req.body.value,
				userId: res.locals.user.id
			}).then(function() {
				res.json({
					status: "ok"
				});
			});
		} else {
			knex("prefs").where({
				name: req.body.name
			}).update({
				value: req.body.value,
				userId: res.locals.user.id
			}).then(function() {
				res.json({
					status: "ok"
				});
			});
		}
	}).catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error"
		});
	});
});

module.exports = router;
