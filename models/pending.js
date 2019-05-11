const config = require("../config.json");
const db = require("../db");

exports.count = function (user_id) {
	return new Promise((resolve, reject) => {
		let query;
		if (user_id !== undefined) {
			query = `SELECT COUNT(*) as cnt FROM youtube_pending WHERE ? AND date >= DATE_SUB(NOW(), INTERVAL ${config.limits.pending.time.registered} MINUTE)`;
		} else {
			query = `SELECT COUNT(*) as cnt FROM youtube_pending WHERE user_id = 0 AND date >= DATE_SUB(NOW(), INTERVAL ${config.limits.pending.time.anonymous} MINUTE)`;
		}

		db.get().query(query, {
			user_id
		}, (err, result) => {
			if (err) {
				return reject({
					err: "error during mysql query"
				});
			}

			resolve(result[0].cnt);
		});
	});
}

exports.add = function (domain, video_id, types, timestamps, user_id) {
	return new Promise((resolve, reject) => {
		db.get().query(`INSERT INTO ${domain}_pending SET ?, date = NOW();`, {
			video_id, types, timestamps, user_id
		}, (err, result) => {
			if (err) {
				return reject({
					err: "error during mysql query"
				});
			}

			resolve(true);
		});
	});
}
