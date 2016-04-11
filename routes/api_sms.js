var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.post("/setPhone", global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.body.phone == undefined) {
		res.json({
			status: "error",
			error: "Missing phone parameter!"
		});
		return;
	}
	if (req.body.carrier == undefined) {
		res.json({
			status: "error",
			error: "Missing carrier parameter!"
		});
		return;
	}
	var carriers = require("../sms");
	if (carriers[req.body.carrier] === undefined) {
		res.json({
			status: "error",
			error: "Invalid carrier!"
		});
		return;
	}
	require('crypto').randomBytes(6, function(err, buffer) {
		var verifyCode = buffer.toString('hex');
		knex("phones").select("*").where({
			userId: res.locals.user.id
		}).then(function(selects) {
			if(selects.length == 0) {
				knex("phones").insert({
					userId: res.locals.user.id,
					phoneNum: req.body.phone,
					carrierEmail: carriers[req.body.carrier],
					verifyCode: verifyCode
				}).then(function() {
					res.json({
						status: "ok",
					});
				}).catch(function(error) {
					res.json({
						status: "error",
						error: "Unknown database error.",
						verifyCode: verifyCode
					});
				});
			}
			else {
				knex("phones").update({
					phoneNum: req.body.phone,
					carrierEmail: carriers[req.body.carrier],
					verified: 0,
					verifyCode: verifyCode
				}).then(function() {
					res.json({
						status: "ok",
					});
				}).catch(function(error) {
					res.json({
						status: "error",
						error: "Unknown database error."
					});
				});
			}
		}).catch(function(ex) {
			res.json({
				status: "error",
				error: "Unknown database error."
			});
		});
	});
});

module.exports = router;
