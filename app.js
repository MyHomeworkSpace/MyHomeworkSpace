var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var KnexSessionStore = require('connect-session-knex')(session);

var app = express();

var basePath = "/";
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
		if (global.isApiPath(req.url)) {
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
	// TODO: error on api pages?
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
	});/*.catch(fction() {
		res.render("error", { title: "Error", msg: "A database communication error has occurred. Please try to log out and log back in. If you have lost data, please contact us as soon as possible."});
	});*/
};

global.apiCall = function(req, res, next) {
	next();
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
var api_planner = require('./routes/api_planner');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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

app.use(basePath + '/', express.static(path.join(__dirname, 'public')));

app.use(basePath + '/', routes);
app.use(basePath + '/app', appRouter);

app.use(basePath + '/api/v1/', api_main);
app.use(basePath + '/api/v1/planner', api_planner);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		//res.status(err.status || 500);
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
