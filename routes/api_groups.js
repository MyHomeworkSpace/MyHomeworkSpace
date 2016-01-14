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
			result:"error",
			error:"Unknown database error!"
		});
	});
});

router.get("/getGroupsIn/", global.requireUser, global.getUserRecord, function(req,res,next){
	knex("groupMembers").where({
		userId: res.locals.user.id
	}).select("groupId").then(function(result){
		res.json({
			result: "ok",
			data: result
		});
	}).catch(function() {
		res.json({
			result: "error",
			error: "Unknown database error!"
		});
	});
});

//for stupid emlyns put cod above here
//for stupider emlyns if ur below this line ur 2 far down
// ==============================================================



module.exports = router;
