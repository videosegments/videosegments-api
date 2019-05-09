const bcryptjs = require("bcryptjs");
const db = require("../db");

exports.FLAG = {
	NOCAPTCHA: 1,
	NOREVIEW: 2,
	MODERATOR: 4
}

exports.exists = function (login) {
	return new Promise((resolve, reject) => {
		db.get().query(`SELECT user_id FROM _users WHERE ?`, {
			login
		}, (err, result) => {
			if (err) {
				return reject({
					err: "error during mysql query"
				});
			}

			if (result.length === 1) {
				return resolve(true);
			} else {
				return resolve(false);
			}
		});
	});
}

exports.register = function (login, password) {
	return new Promise((resolve, reject) => {
		bcryptjs.hash(password, 8, (err, hash) => {
			if (err) return reject({err});
			db.get().query(`INSERT INTO _users SET ?;`, {
				login, password: hash
			}, (err, result) => {
				if (err) return reject(err);
				resolve(true);
			});
		});
	});
}

exports.login = function (login, password) {
	return new Promise((resolve, reject) => {
		db.get().query(`SELECT user_id, password, score, flags FROM _users WHERE ? LIMIT 1;`, {
			login
		}, (err, result) => {
			if (err) return reject(err);
			if (result.length === 0) return resolve(false);

			bcryptjs.compare(password, result[0].password, (err, res) => {
				if (res) {
					return resolve(JSON.parse(JSON.stringify(result[0])));
				} else {
					return resolve(false);
				}
			});
		});
	});
}

exports.findById = function (user_id) {
	return new Promise((resolve, reject) => {
		db.get().query("SELECT user_id, score, flags FROM _users WHERE ? LIMIT 1;", {
			user_id
		}, (err, result) => {
			if (err) return reject(err);
			if (result.length === 0) return resolve(undefined);
			return resolve(JSON.parse(JSON.stringify(result[0])));
		});
	});
}