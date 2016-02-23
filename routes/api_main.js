var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/csrf', function(req, res, next) { // DO NOT PUT global.apiCall HERE OR ELSE YOU WILL NEED A NONCE TO GET A NONCE
	var crypto = require("crypto");
	var token = crypto.randomBytes(16).toString('hex');
	knex("nonces").insert({ nonce: token, sid: req.session.id }).then(function() {
		res.json({
			status: "ok",
			version: "1",
			nonce: token
		});
	});
});

router.get('/csrfPool', function(req, res, next) { // DO NOT PUT global.apiCall HERE OR ELSE YOU WILL NEED A NONCE TO GET A NONCE
	var crypto = require("crypto");

	var nonces = [];
	var toGenerate = 20;
	for (var i = 0; i < toGenerate; i++) {
		nonces.push({ nonce: crypto.randomBytes(16).toString('hex'), sid: req.session.id});
	}
	knex("nonces").insert(nonces).then(function() {
		res.json({
			status: "ok",
			version: "1",
			nonces: nonces
		});
	});
});

router.get('/features/get/', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	knex("users").select("*").where({
		id: res.locals.user.id
	}).then(function(obj) {
		var features = [];
		if (obj[0].features) {
			features = JSON.parse(obj[0].features);
		}
		res.json({
			status: "ok",
			features: features
		});
	}).catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error"
		});
	});
});

router.post('/features/add/', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.body.feature == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid feature parameter."
		});
		return;
	}

	var feature = "";
	switch (req.body.feature) {
		case "planner":
			feature = "planner";
			break;

		case "hwView":
			feature = "hwView";
			break;

		case "myDay":
			feature = "myDay";
			break;

		default:
			res.json({
				status: "error",
				error: "Missing or invalid feature parameter."
			});
			return;
	}

	knex("users").select("*").where({
		id: res.locals.user.id
	}).then(function(obj) {
		var features = [];
		if (obj[0].features) {
			features = JSON.parse(obj[0].features);
		}
		features.push(feature);
		knex.transaction(function(trx) {
			return trx.where({ id: res.locals.user.id }).update({ features: JSON.stringify(features) }).into("users").then(function() {
				if (feature == "planner") {
					return trx.insert([{ sectionIndex: 0, name: "Math", userId: res.locals.user.id },
								{ sectionIndex: 1, name: "History", userId: res.locals.user.id },
								{ sectionIndex: 2, name: "English", userId: res.locals.user.id },
								{ sectionIndex: 3, name: "Language", userId: res.locals.user.id },
								{ sectionIndex: 4, name: "Science", userId: res.locals.user.id }]).into("planner_sections");
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
	}).catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error"
		});
	});
});

router.post('/feedback/post/', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.body.type == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid type parameter."
		});
		return;
	}
	if (req.body.msg == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid msg parameter."
		});
		return;
	}
	if (req.body.name == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid name parameter."
		});
		return;
	}
	if (req.body.username == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid username parameter."
		});
		return;
	}

	knex("feedback").insert({
		type: req.body.type,
		msg: req.body.msg,
		name: req.body.name,
		username: req.body.username,
		webpage: req.body.webpage,
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
