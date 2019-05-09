const db = require("../db");

exports.get = function (domain, video_id) {
	return new Promise((resolve, reject) => {
		db.get().query(`SELECT timestamps, types FROM ${domain} WHERE ? LIMIT 1;`, {
			video_id
		}, (err, result) => {
			if (err) {
				return reject({
					err: "error during mysql query"
				});
			}

			if (result.length === 1) {
				return resolve(result[0]);
			} else {
				return resolve(false);
			}
		});
	});
}

exports.add = function (domain, video_id, types, timestamps, user_id) {
	return new Promise((resolve, reject) => {
		db.get().query(`INSERT INTO ${domain} SET ?, date = NOW();`, {
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