var express = require('express');
var router = express.Router();

router.get('/', global.apiCall, function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

router.get('/announcements/get/:date', global.apiCall, function(req, res, next) {
	if (req.params.date == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid date parameter!"
		});
		return;
	}
	global.knex.select('*').from('planner_announcements').limit(1).where({
		date: req.params.date
	}).then(function (data) {
		if (data.length == 0) {
			res.json({
				status: "ok",
				announcement: null
			});
		} else {
			res.json({
				status: "ok",
				announcement: data[0]
			});
		}
	}).catch(function(error) {
		console.error("DB ERROR!");
		console.error(error);
		res.json({
			status: "error",
			error: "Database error"
		});
	});
});

router.get('/fridays/get/:date', global.apiCall, function(req, res, next) {
	if (req.params.date == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid date parameter!"
		});
		return;
	}
	global.knex.select('*').from('planner_fridays').limit(1).where({
		date: req.params.date
	}).then(function (data) {
		if (data.length == 0) {
			res.json({
				status: "ok",
				friday: null
			});
		} else {
			res.json({
				status: "ok",
				friday: data[0]
			});
		}
	}).catch(function(error) {
		console.error("DB ERROR!");
		console.error(error);
		res.json({
			status: "error",
			error: "Database error"
		});
	});
});

router.get('/events/get/:date/:section_index', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.params.date == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid date parameter!"
		});
		return;
	}
	if (req.params.section_index == undefined || parseInt(req.params.section_index) == NaN) {
		res.json({
			status: "error",
			error: "Missing or invalid section index parameter!"
		});
		return;
	}
	knex("planner_events").select("*").where({
		userId: res.locals.user.id,
		date: req.params.date,
		sectionIndex: req.params.section_index
	}).then(function(obj) {
		res.json({
			status: "ok",
			date: req.params.date,
			events: obj
		});
	}).catch(function() {
		res.json({
			status: "error",
			date: req.params.date,
			error: "Unknown database error"
		});
	});
});

router.get('/events/getWeek/:date/:section_index', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.params.date == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid date parameter!"
		});
		return;
	}
	if (req.params.section_index == undefined || parseInt(req.params.section_index) == NaN) {
		res.json({
			status: "error",
			error: "Missing or invalid section index parameter!"
		});
		return;
	}
	var endOfWeek = new Date(req.params.date);
	endOfWeek.setDate(endOfWeek.getDate() + 7);
	knex("planner_events").select("*").where({
		userId: res.locals.user.id,
		sectionIndex: req.params.section_index
	}).andWhere("date", ">=", req.params.date).andWhere("date", "<", endOfWeek).then(function(obj) {
		res.json({
			status: "ok",
			startDate: req.params.date,
			events: obj
		});
	}).catch(function() {
		res.json({
			status: "error",
			startDate: req.params.date,
			error: "Unknown database error"
		});
	});
});

router.post('/events/post/', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.body.date == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid date parameter!"
		});
		return;
	}
	if (req.body.subjectIndex == undefined || parseInt(req.body.subjectIndex) == NaN) {
		res.json({
			status: "error",
			error: "Missing or invalid section index parameter!"
		});
		return;
	}
	if (req.body.text == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid text parameter!"
		});
		return;
	}
	if (req.body.done == undefined || parseInt(req.body.done) == NaN || (parseInt(req.body.done) != 0 && parseInt(req.body.done) != 1)) {
		res.json({
			status: "error",
			error: "Missing or invalid done parameter!"
		});
		return;
	}
	if (req.body.subId == undefined || parseInt(req.body.subId) == NaN) {
		res.json({
			status: "error",
			error: "Missing or invalid subId parameter!"
		});
		return;
	}
	knex("planner_events").select("*").where({
		userId: res.locals.user.id,
		date: req.body.date,
		subId: req.body.subId,
		sectionIndex: req.body.subjectIndex
	}).then(function(obj) {
		if (obj.length == 0) {
			// no event, insert it
			knex("planner_events").insert({
				sectionIndex: req.body.subjectIndex,
				userId: res.locals.user.id,
				date: req.body.date,
				text: req.body.text,
				subId: req.body.subId,
				done: req.body.done
			}).then(function() {
				res.json({
					status: "ok"
				});
			});/*.catch(function() {
				res.json({
					status: "error",
					error: "Database error"
				});
			});*/
		} else {
			// an event! update it
			knex("planner_events").where({ eventId: obj[0].eventId }).update({
				text: req.body.text,
				done: req.body.done
			}).then(function() {
				res.json({
					status: "ok"
				});
			});/*.catch(function() {
				res.json({
					status: "error",
					error: "Database error"
				});
			});*/
		}
	});/*.catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error"
		});
	});*/
});

router.get('/sections/get/', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	knex("planner_sections").select("*").where({
		userId: res.locals.user.id
	}).then(function(obj) {
		res.json({
			status: "ok",
			sections: obj
		});
	});
});

router.post('/sections/add', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.body.sectionName == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid section name parameter!"
		});
		return;
	}
	knex("planner_sections").select("*").where({
		userId: res.locals.user.id
	}).then(function(obj) {
		var newSectionId = 0;
		if (obj.length > 0) {
			newSectionId = obj[obj.length - 1].sectionIndex + 1;
		}
		knex("planner_sections").insert({
			sectionIndex: newSectionId,
			name: req.body.sectionName,
			userId: res.locals.user.id
		}).then(function() {
			res.json({
				status: "ok",
				newIndex: obj.length
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

router.post('/sections/rename', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.body.sectionIndex == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid section index parameter!"
		});
		return;
	}
	if (req.body.newName == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid new name parameter!"
		});
		return;
	}
	knex("planner_sections").select("*").where({
		userId: res.locals.user.id,
		sectionIndex: req.body.sectionIndex
	}).then(function(obj) {
		var itm = obj[0];
		knex("planner_sections").where({
			sectionGid: itm.sectionGid
		}).update({
			name: req.body.newName
		}).then(function() {
			res.json({
				status: "ok"
			});
		});
	}).catch(function(e) {
		console.log(e);
		res.json({
			status: "error",
			error: "Unknown database error."
		});
	});
});

router.post('/sections/swap', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.body.first == undefined || parseInt(req.body.first) == NaN) {
		res.json({
			status: "error",
			error: "Missing or invalid first index parameter!"
		});
		return;
	}
	if (req.body.second == undefined || parseInt(req.body.second) == NaN) {
		res.json({
			status: "error",
			error: "Missing or invalid second index parameter!"
		});
		return;
	}
	// verify both sections exist
	knex("planner_sections").select("*").where("userId", res.locals.user.id).
		where(function() {
			this.where("sectionIndex", parseInt(req.body.first)).orWhere("sectionIndex", parseInt(req.body.second))
		}).then(function(obj) {
		if (obj.length != 2) {
			res.json({
				status: "error",
				error: "Missing or invalid indexes! " + obj.length
			});
			return;
		}

		// use a transaction so things don't get inconsistent
		knex.transaction(function(trx) {
			return trx("planner_sections").where({
				sectionGid: obj[0].sectionGid
			}).update({
				sectionIndex: -999 // use this for swapping
			}).then(function() {
				return trx("planner_events").where({
					sectionIndex: obj[0].sectionIndex,
					userId: obj[0].userId
				}).update({
					sectionIndex: -999
				}).then(function() {
					return trx("planner_sections").where({
						sectionGid: obj[1].sectionGid
					}).update({
						sectionIndex: obj[0].sectionIndex
					}).then(function() {
						return trx("planner_events").where({
							sectionIndex: obj[1].sectionIndex,
							userId: obj[1].userId
						}).update({
							sectionIndex: obj[0].sectionIndex
						}).then(function() {
							return trx("planner_sections").where({
								sectionIndex: -999
							}).update({
								sectionIndex: obj[1].sectionIndex
							}).then(function() {
								return trx("planner_events").where({
									sectionIndex: -999
								}).update({
									sectionIndex: obj[1].sectionIndex
								});
								console.log("qwer");
							});
						});
					});
				});
			});
		}).then(function() {
			console.log("Asdf");
			res.json({
				status: "ok"
			});
		}).catch(function(e) {
			console.log(e);
			res.json({
				status: "error",
				error: "Unknown database error."
			});
		});
	}).catch(function(e) {
		console.log(e);
		res.json({
			status: "error",
			error: "Unknown database error."
		});
	});
});

router.post('/sections/remove', global.apiCall, global.requireUser, global.getUserRecord, function(req, res, next) {
	if (req.body.sectionIndex == undefined) {
		res.json({
			status: "error",
			error: "Missing or invalid section index parameter!"
		});
		return;
	}
	// use a transaction for consistency
	knex.transaction(function(trx) {
		return trx("planner_sections").select("*").where({
			userId: res.locals.user.id,
			sectionIndex: req.body.sectionIndex
		}).then(function(obj) {
			var itm = obj[0];
			return trx("planner_sections").where({
				sectionGid: itm.sectionGid
			}).update({
				sectionIndex: itm.sectionIndex * -1, // TODO: change this to del after beta and code path is tested
				userId: itm.userId * -1
			}).then(function() {
				return trx("planner_events").where({
					sectionIndex: itm.sectionIndex, // TODO: see above comment
					userId: itm.userId
				}).update({
					sectionIndex: itm.sectionIndex * -1,
					userId: itm.userId * -1
				});
			});
		});
	}).then(function() {
		res.json({
			status: "ok"
		});
	}).catch(function() {
		res.json({
			status: "error",
			error: "Unknown database error."
		});
	});
});

module.exports = router;
