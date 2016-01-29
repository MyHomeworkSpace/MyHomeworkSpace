/*
	PlanHub
	https://planhub.me
	https://github.com/PlanHubMe/PlanHub
	Licensed under the MIT License.
*/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var KnexSessionStore = require('connect-session-knex')(session);

var app = express();

var basePath = "";
global.basePath = basePath;

var env = "development";
global.env = ((app.get("env") == "production") ? app.get("env") : env);

var config = require("./config");
global.mysqlConnection = config.dbConnection;

global.knex = require('knex')({
	client: 'mysql',
	connection: global.mysqlConnection,
	pool: {
		min: 2,
		max: 10
	}
});

global.sessionStore = new KnexSessionStore({
	knex: global.knex
});

global.isApiPath = function(path) {
	return path.indexOf("api") > -1;
};

global.requireUser = function(req, res, next) {
	if (req.session.loggedIn) {
		next();
	} else {
		if (res.locals.apiCall) {
			res.json({
				status: "auth_required",
				message: "Authentication is required."
			});
		} else {
			res.redirect(global.basePath + "/login");
		}
	}
};

global.getUserRecord = function(req, res, next) {
	// TODO: errors on api pages?
	global.knex("users").select("*").where({ username: req.session.username }).then(function(obj) {
		if (obj.length > 1) {
			res.render("error", { title: "Error", msg: "A database error has occurred, and there is a duplicate user record. Please contact us for assistance." });
			return;
		}
		if (obj.length == 0) {
			res.render("error", { title: "Error", msg: "A database error has occurred. Your user record is missing. Please log out and log back in. If you have lost data, please contact us as soon as possible."});
			return;
		}
		res.locals.user = obj[0];
		next();
	});/*.catch(function() {
		res.render("error", { title: "Error", msg: "A database communication error has occurred. Please try to log out and log back in. If you have lost data, please contact us as soon as possible."});
	});*/
};

global.requireNonZeroLevel = function(req, res, next) {
	if (res.locals.user.level < 0) {
		if (res.locals.apiCall) {
			res.json({
				status: "forbidden",
				message: "You are not permitted to access this resource."
			});
		} else {
			res.redirect(global.basePath + "/login");
		}
	} else {
		next();
	}
};

global.requireViewFeedback = function(req, res, next) {
	if (res.locals.user.canFeedback != 1) {
		if (res.locals.apiCall) {
			res.json({
				status: "forbidden",
				message: "You are not permitted to access this resource."
			});
		} else {
			res.redirect(global.basePath + "/login");
		}
	} else {
		next();
	}
};

global.requireEditAnnouncements = function(req, res, next) {
	if (res.locals.user.canAnnouncements != 1) {
		if (res.locals.apiCall) {
			res.json({
				status: "forbidden",
				message: "You are not permitted to modify this resource."
			});
		} else {
			res.redirect(global.basePath + "/login");
		}
	} else {
		next();
	}
};

global.apiCall = function(req, res, next) {
	res.locals.apiCall = true;
	knex("nonces").where({ nonce: req.param("nonce"), sid: req.session.id }).select("*").then(function(rst) {
		if (rst.length > 0) {
			knex("nonces").where({ nonce: req.param("nonce"), sid: req.session.id }).del().then(function() {
				next();
			});
		} else {
			res.json({
				status: "error",
				error: "The nonce is invalid."
			});
		}
	});
};

global.getOptionalUserRecord = function(req, res, next) {
	if (!req.session.loggedIn) {
		next();
		return;
	}
	global.knex("users").select("*").where({ username: req.session.username }).then(function(obj) {
		if (obj.length > 1) {
			res.render("error", { title: "Error", msg: "A database error has occurred, and there is a duplicate user record. Please contact us for assistance." });
			return;
		}
		if (obj.length == 0) {
			res.render("error", { title: "Error", msg: "A database error has occurred. Your user record is missing. Please log out and log back in. If you have lost data, please contact us as soon as possible."});
			return;
		}
		res.locals.user = obj[0];
		next();
	});
};

global.dbErrorHandler = function(err, req, res, next) {
		if (res.locals.apiCall) {
			res.json({
				status: "error",
				error: "Database error"
			});
		} else {
			res.render("error", { title: "Error", msg: "Database error occured. Please email hello@planhub.me for assistance. Mention what you were trying to do."});
		}
};

if (!String.prototype.encodeHTML) {
	String.prototype.encodeHTML = function () {
		return this.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;')
					.replace(/'/g, '&apos;');
	};
}

// require routes here so they can access globals
var routes = require('./routes/index');
var appRouter = require('./routes/app');

var api_main = require('./routes/api_main');
var api_ext = require('./routes/api_ext');
var api_labs = require('./routes/api_labs');
var api_hwView = require('./routes/api_hwView');
var api_myDay = require('./routes/api_myDay');
var api_overview = require('./routes/api_overview');
var api_planner = require('./routes/api_planner');
var api_prefs = require('./routes/api_prefs');
var api_admin = require('./routes/api_admin');
var api_groups = require('./routes/api_groups');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// sessions
var sess = {
	store: global.sessionStore,
	secret: 'keyboard cat',
	cookie: {}
};

if (global.env == "production") {
	sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

app.use(function(req, res, next) {
	if (req.host == "staging.planhub.me") {
		res.locals.isStaging = true;
	} else {
		res.locals.isStaging = false;
	}
	next();
});

app.use(basePath + '/', express.static(path.join(__dirname, 'public')));

app.use(basePath + '/', routes);
app.use(basePath + '/app', appRouter);

app.use(basePath + '/api/v1/', api_main);
app.use(basePath + '/api/v1/ext', api_ext);
app.use(basePath + '/api/v1/labs', api_labs);
app.use(basePath + '/api/v1/hwView', api_hwView);
app.use(basePath + '/api/v1/myDay', api_myDay);
app.use(basePath + '/api/v1/overview', api_overview);
app.use(basePath + '/api/v1/planner', api_planner);
app.use(basePath + '/api/v1/prefs', api_prefs);
app.use(basePath + '/api/v1/admin', api_admin);
app.use(basePath + '/api/v1/groups', api_groups)

// catch 404 and forward to error handler
app.use(global.getOptionalUserRecord); // get record to show logged in on 404 

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
app.use(function(err, req, res, next) {
	// logging
	if (err) {
		var status = (err.status || 500);
		var message = (err.message || "");
		var name = (err.name || "");
		var stack = (err.stack || "");
		var username = (req.session.loggedIn ? req.session.username : undefined);
		var url = req.url;
		var headers = JSON.stringify(req.headers);
		knex("errors").insert({
			username: username,
			status: status,
			stack: stack,
			msg: message,
			url: url,
			headers: headers
		}).then(function() {
			res.locals.errorLogged = true;
			next(err);
		}).catch(function() {
			res.locals.errorLogged = false;
			next(err);
		});
	} else {
		next(err);
	}
});

app.use(function(err, req, res, next) {
	// 404
	if (err.status == 404) {
		res.status(404);
		res.render("404");
	} else {
		next(err);
	}
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
