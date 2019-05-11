const config = require("../config.json");
const bcryptjs = require("bcryptjs");
const users = require("../models/users");
const segmentation = require("../models/segmentation");
const pending = require("../models/pending");
const db = require("../db");

before(next => {
	truncate_db().then(() => {
		populate_users().then(() => {
			populate_videos().then(() => {
				next();
			});
		});
	});
});

function truncate_db() {
	return new Promise((resolve, reject) => {
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
							resolve();
						});
					});
				});
			});
		});
	});
}

function populate_users() {
	return new Promise((resolve, reject) => {
		users.register(config.test.user.login, config.test.user.password).then(() => {
			bcryptjs.hash(config.test.admin.password, 8, (err, hash) => {
				if (err) throw new Error(err);
				db.get().query(`INSERT INTO _users SET login = "${config.test.admin.login}", password = "${hash}", flags = 7`, err => {
					if (err) throw new Error(err);
					bcryptjs.hash(config.test.moderator.password, 8, (err, hash) => {
						if (err) throw new Error(err);
						db.get().query(`INSERT INTO _users SET login = "${config.test.moderator.login}", password = "${hash}", flags = 4`, err => {
							if (err) throw new Error(err);
							resolve();
						});
					});
				});
			});
		});
	});
}

function populate_videos() {
	return new Promise((resolve, reject) => {
		segmentation.add("youtube", config.test.video.existing, "c,a,c", "10.0,20.0", 0).then(() => {
			pending.add("youtube", "00000000000", "c,a,c", "10.0,20.0", 0).then(() => {
				pending.add("youtube", "00000000001", "c,a,c", "10.0,20.0", 0).then(() => {
					pending.add("youtube", "00000000002", "c,a,c", "10.0,20.0", 0).then(() => {
						pending.add("youtube", "00000000003", "c,a,c", "10.0,20.0", 0).then(() => {
							pending.add("youtube", "00000000004", "c,a,c", "10.0,20.0", 0).then(() => {
								pending.add("youtube", "00000000005", "c,a,c", "10.0,20.0", 0).then(() => {
									pending.add("youtube", "00000000006", "c,a,c", "10.0,20.0", 0).then(() => {
										pending.add("youtube", "00000000007", "c,a,c", "10.0,20.0", 0).then(() => {
											pending.add("youtube", "00000000008", "c,a,c", "10.0,20.0", 0).then(() => {
												next();
											});
										});
									});
								});
							});
						});
					});
				});
			});
			resolve();
		});
	});
}