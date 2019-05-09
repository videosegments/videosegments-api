const users = require("../models/users");

exports.register = function (req, res) {
	if (req.user) {
		return res.json({err: "user registered"});
	}

	users.exists(req.body.login).then(result => {
		if (result) {
			return res.json({err: "user exists"});
		}

		users.register(req.body.login, req.body.password).then(result => {
			if (result) {
				res.json({success: true});
			}
		}).catch(err => {
			res.json(err);
		});
	}).catch(err => {
		res.json({err});
	});
}

exports.login = function (req, res) {
	res.json({success: true});
}