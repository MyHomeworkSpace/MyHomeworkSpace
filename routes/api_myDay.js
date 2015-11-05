var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({
		status: "ok",
		version: "1"
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