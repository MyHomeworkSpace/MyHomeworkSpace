var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});
router.post('/info/set', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if(req.body.sleep == undefined || parseInt(req.body.sleep) == NaN || parseInt(req.body.sleep) <= 0) {
		res.json({
			status: "error",
			error: "Missing or invalid sleep parameter!"
		});
		return;
	}
	if(req.body.wake == undefined) {
		res.json({
			status: "error",
			error: "Missing wake parameter!"
		});
		return;
	}
	if(req.body.address == undefined) {
		res.json({
			status: "error",
			error: "Missing address parameter!"
		});
		return;
	}
	if(req.body.schoolId == undefined || parseInt(req.body.schoolId) == NaN) {
		res.json({
			status: "error",
			error: "Missing or invalid schoolId parameter!"
		});
		return;
	}
	knex("myDay").select("*").where({
		userId: res.locals.user.id
	}).then(function() {
		knex("myDay").insert({
			userId: res.locals.user.id,
			sleep: parseInt(req.body.sleep),
			wake: req.body.wake,
			address: req.body.address,
			clubs: req.body.clubs,
			schoolId: parseInt(req.body.schoolId)
		}).then(function() {
			res.json({
				status: "ok",
			});
		}).catch(function() {
			res.json({
				status: "error",
				error: "Unknown database error."
			});
		});
	}).catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error."
		});
	});
});
router.get('/clubs/getAll/', function(req, res, next) {
	knex("clubs").select("*").then(function(data) {
		res.json({
			status: "ok",
			clubs: data/*[
				{
					clubId: 0,
					name: "Fake club",
					meetings: "B(MF1)"
				}
			]*/
		});
	});
});

module.exports = router;
