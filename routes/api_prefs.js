var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/prefs/get/:name', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	knex("prefs").select("*").where({
		name: req.params.name,
		userId: res.locals.user.id
	}).then(function(obj) {
		res.json({
			status: "ok",
			name: req.params.name,
			val: obj[0].val
		})
	}).catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error"
		});
	});
});

router.post('/prefs/set/', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.body.name == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid name parameter."
		});
		return;
	}
	if (req.body.val == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid val parameter."
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
				val: req.body.val,
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
				val: req.body.val,
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

router.post('/prefs/setName/', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.body.name == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid name parameter."
		});
		return;
	}

	knex("users").where({
		userId: res.locals.user.id
	}).update({
		name: req.body.name
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

module.exports = router;