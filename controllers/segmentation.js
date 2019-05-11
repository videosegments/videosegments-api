const config = require("../config.json");

const segmentation = require("../models/segmentation");
const pending = require("../models/pending");
const users = require("../models/users");

exports.get = function (req, res) {
	if (!validateDomain(req.params.domain)) {
		return res.json({
			err: "domain is not supported"
		});
	}

	if (!validateId(req.params.video_id)) {
		return res.json({
			err: "invalid video id"
		});
	}

	segmentation.get(req.params.domain, req.params.video_id).then(result => {
		if (result) {
			res.json(result);
		} else {
			res.json({});
		}
	}).catch(err => {
		res.json(err);
	});
}

function validateDomain(domain) {
	if (domain === "youtube") {
		return true;
	}
	return false;
}

function validateId(id) {
	if (id.length === 11) {
		return true;
	}
	return false;
}

exports.post = function (req, res) {
	if (!validateDomain(req.params.domain)) {
		return res.json({
			err: "domain is not supported"
		});
	}

	if (!validateId(req.params.video_id)) {
		return res.json({
			err: "invalid video id"
		});
	}

	if (!req.body.types || !req.body.timestamps) {
		return res.json({
			err: "no type(s) or timestamp(s) field(s)"
		});
	}

	let types = req.body.types.split(",");
	if (!validateTypes(types)) {
		return res.json({
			err: "invalid types"
		});
	}

	let timestamps = req.body.timestamps.split(",").map(value => Number(value));
	if (!validateTimestamps(timestamps)) {
		return res.json({
			err: "invalid timestamps"
		});
	}

	if (types.length !== timestamps.length + 1) {
		return res.json({
			err: "invalid types or timestamps length"
		});
	}

	segmentation.get(req.params.domain, req.params.video_id).then(result => {
		if (result === false) {
			checkQueue(req.user).then(result => {
				let addSegmentation = () => {
					if (req.user && ((req.user.flags & users.FLAG.NOREVIEW) || (req.user.flags & users.FLAG.MODERATOR))) {
						segmentation.add(req.params.domain, req.params.video_id, req.body.types, req.body.timestamps, req.user.user_id);
						res.json({
							added: "database"
						});
					} else {
						pending.add(req.params.domain, req.params.video_id, req.body.types, req.body.timestamps, req.user ? req.user.user_id : 0);
						res.json({
							added: "pending"
						});
					}
				};
				
				// if captcha is required 
				if (result === false) {
					checkCaptcha(req, req.user).then(result => {
						if (result) {
							addSegmentation();
						} else {
							res.json({
								captcha: true
							});
						}
					});
				} else {
					addSegmentation();
				}

			}).catch(err => {
				res.json({
					err
				});
			});
		} else {
			res.json({
				err: "segmentation exists"
			});
		}
	}).catch(err => {
		res.json({
			err
		});
	});
}

function checkCaptcha(req, user) {
	return new Promise((resolve, reject) => {
		if (user) {
			if (user.flags & users.FLAG.NOCAPTCHA) {
				return resolve(true);
			}
		}

		if (req.body['g-recaptcha-response'] !== undefined) {
			let verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + config.googleSecret + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
			request(verificationUrl, function (error, response, body) {
				body = JSON.parse(body);
				if (body.success !== undefined && !body.success) {
					return resolve(false);
				}

				resolve(true);
			});
		}

		resolve(false);
	});
}

function checkQueue(user) {
	return new Promise((resolve, reject) => {
		let user_id, limit;
		if (user) {
			if ((user.flags & users.FLAG.NOREVIEW) || (user.flags & users.FLAG.MODERATOR)) {
				return resolve(true);
			}

			limit = config.limits.pending.count.registered;
			user_id = user.user_id;
		} else {
			limit = config.limits.pending.count.anonymous;
		}

		pending.count(user_id).then(result => {
			if (result < limit) {
				return resolve(true);
			}

			resolve(false);
		}).catch(err => {
			reject(err);
		});
	});
}

function validateTypes(types) {
	let previous = "";
	const whitelist = ["a", "ac", "cs", "i", "c", "o", "ia", "s", "cr"];
	for (let type of types) {
		if (whitelist.indexOf(type) === -1 || previous === type) {
			return false;
		}
		previous = type;
	}

	return true;
}

function validateTimestamps(timestamps) {
	let previous = 0.0;
	for (let timestamp of timestamps) {
		if (previous >= timestamp) {
			return false;
		}
		previous = timestamp;
	}

	return true;
}