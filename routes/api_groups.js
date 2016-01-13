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



//for stupid emlyns put cod above here
//for stupider emlyns if ur below this line ur 2 far down
// ==============================================================



module.exports = router;
