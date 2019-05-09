const config = require("../config.json");
const bcryptjs = require("bcryptjs");
const users = require("../models/users");
const segmentation = require("../models/segmentation");
const db = require("../db");

before(next => {
	db.get().query("TRUNCATE TABLE _users", err => {
		if (err) throw new Error(err);
		db.get().query("TRUNCATE TABLE _sessions", err => {
			if (err) throw new Error(err);
			db.get().query("TRUNCATE TABLE _logs", err => {
				if (err) throw new Error(err);
				db.get().query("TRUNCATE TABLE youtube", err => {
					if (err) throw new Error(err);
					db.get().query("TRUNCATE TABLE youtube_pending", err => {
						if (err) throw new Error(err);
						users.register(config.test.user.login, config.test.user.password).then(() => {
							segmentation.add("youtube", config.test.video.existing, "c,a,c", "10.0,20.0", 0).then(() => {
								bcryptjs.hash(config.test.admin.password, 8, (err, hash) => {
									if (err) throw new Error(err);
									db.get().query(`INSERT INTO _users SET login = "${config.test.admin.login}", password = "${hash}", flags = 7`, err => {
										if (err) throw new Error(err);
										bcryptjs.hash(config.test.moderator.password, 8, (err, hash) => {
											if (err) throw new Error(err);
											db.get().query(`INSERT INTO _users SET login = "${config.test.moderator.login}", password = "${hash}", flags = 4`, err => {
												if (err) throw new Error(err);
												next();
											});
										});
									});
								});
							}).catch(err => {
								throw new Error(err);
							});
						}).catch(err => {
							throw new Error(err);
						});
					});
				});
			});
		});
	});
});