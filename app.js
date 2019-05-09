// =================================================================================
// THIRD-PARTY FILES
// =================================================================================
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);
const localStrategy = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const express = require("express");
const cors = require("cors");

// =================================================================================
// LOCAL FILES
// =================================================================================
const config = require("./config.json");
const db = require("./db");

// =================================================================================
// CONTROLLERS 
// =================================================================================
const segmentation = require("./controllers/segmentation");
const users = require("./controllers/users");

// =================================================================================
// MODELS 
// =================================================================================
const user = require("./models/users");

// =================================================================================
// MODULES INITIALIZATION
// =================================================================================
const app = express();

let env = process.env.NODE_ENV || "dev";
env = env.trim();

db.connect(config[env].database);
db.createTables();

// =================================================================================
// EXPRESS CONFIGURATION 
// =================================================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors({
	origin: "*",
	optionsSuccessStatus: 200,
	credentials: true,
}));
app.use(cookieParser());
app.use(session({
	store: new mysqlStore({
		expiration: 1000 * 60 * 60 * 24 * 7,
		checkExpirationInterval: 86400000,
		schema: {
			tableName: "_sessions"
		}
	}, db.get()),
	secret: config.sessionSecret,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}));

// =================================================================================
// PASSPORT 
// =================================================================================
passport.use(new localStrategy(
	(login, password, done) => {
		user.login(login, password).then(result => {
			done(null, result);
		}).catch(err => {
			done(err);
		})
	}
));

passport.serializeUser(function (user, done) {
	done(null, user.user_id);
});

passport.deserializeUser(function (user_id, done) {
	user.findById(user_id).then(result => {
		done(null, result);
	}).catch(err => {
		done(err);
	});
});

// =================================================================================
// GENERIC ROUTINES 
// =================================================================================
app.get("/v4/:domain/:video_id", segmentation.get);

// =================================================================================
// USER ROUTINES 
// =================================================================================
app.use(passport.initialize());
app.use(passport.session());

app.post("/v4/:domain/:video_id", segmentation.post);

app.post("/v4/register", users.register);
app.post("/v4/login", passport.authenticate('local'), users.login);

// =================================================================================
// STARTUP
// =================================================================================
app.listen(config[env].port);

// =================================================================================
// ETC 
// =================================================================================
module.exports = app;