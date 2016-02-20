var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
	});
});

// ==============================================================
//for stupider emlyns if ur above this line ur 2 far up
//for stupid emlyns put cod below here
router.get("/getGroups/",function(req,res,next){
	knex("users").where({
		name: "Emlyn Mileaf-Patel"
	}).select("id").then(function(response) {
		 res.json({
		 	result: "ok",
		 	data: response
		 });

	}).catch(function() {
		res.json({
			result: "error",
			error: "Unknown database error!"
		});
	});
});

router.get("/getGroupsIn/", global.requireUser, global.getUserRecord, function(req,res,next){
	knex("groupMembers").where({
		userId: res.locals.user.id
	}).select("groupId").then(function(result){
		groups = [];
		for(i in result) {
			knex("groups").where({
				groupID: i
			}).select("name").then(function(group) {
				groups.append(group[0])
			});
		}
		res.json({
			result: "ok",
			response: result
		});
	}).catch(function() {
		res.json({
			result: "error",
			error: "Unknown database error!"
		});
	});
});

router.post("/newGroup/", global.requireUser, global.getUserRecord, function(req, res, next) {
	knex("groups").insert({name: req.body.groupName, adminID: res.locals.user.id}).then(function(response){
		knex("groupMembers").insert({userID: res.locals.user.id, groupID: response[0]}).then(function(response2){
		res.json({
			status: "ok",
			result: response2,
			otherResult: response
		});
	});
	});
	
});

router.post("/joinGroup/", global.requireUser, global.getUserRecord, function(req, res, next){
	knex("groupMembers").insert({userID: res.locals.user.id, groupID: req.body.groupID}).then(function(response){
		res.json({
			status: "ok",
			result: response
		});
	});
});


//for stupid emlyns put cod above here
//for stupider emlyns if ur below this line ur 2 far down
// ==============================================================



module.exports = router;
