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
			return;
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

router.post('/getBatch/', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.body.names == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid names parameter."
		});
		return;
	}
	var subquery = knex("prefs").select("*");
	var names = JSON.parse(req.body.names);
	for (var nameIndex in names) {
		subquery.orWhere("name", "=", names[nameIndex]);
	}
	knex("prefs").select("*").where({
		userId: res.locals.user.id
	}).andWhere(subquery).then(function(obj) {
		res.json({
			status: "ok",
			prefs: obj
		});
	}).catch(function(e) {
		res.json({
			status: "error",
			error: "Unknown database error",
			e: e
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
	knex.transaction(function(trx) {
		return trx.from("prefs").where({
			name: req.body.name,
			userId: res.locals.user.id
		}).forShare().select("*").then(function(obj) {
			if (obj.length == 0){
				return trx.into("prefs").insert({
					name: req.body.name,
					value: req.body.value,
					userId: res.locals.user.id
				}).then(function() {
					res.json({
						status: "ok"
					});
				});
			} else {
				return trx.into("prefs").where({
					name: req.body.name,
					userId: res.locals.user.id
				}).update({
					value: req.body.value
				});
			}
		});
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
