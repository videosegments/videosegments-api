const mysql = require("mysql");
let pool;

exports.connect = function (options) {
	pool = mysql.createPool(options);
}

exports.get = function () {
	return pool;
}

exports.createTables = function () {
	pool.query("CREATE TABLE IF NOT EXISTS `_users` ( \
		`user_id` int(11) NOT NULL AUTO_INCREMENT, \
		`login` varchar(32) NOT NULL, \
		`email` varchar(64) NOT NULL DEFAULT '', \
		`password` varchar(256) NOT NULL, \
		`score` int(11) NOT NULL DEFAULT 0, \
		`flags` int(4) NOT NULL DEFAULT 0, \
		`activity` date DEFAULT '1970-01-01', \
		PRIMARY KEY (`user_id`) \
	   ) ENGINE=InnoDB DEFAULT CHARSET=utf8", (err, result) => {
		if (err) {
			throw new Error(err);
		}
	});

	pool.query("CREATE TABLE IF NOT EXISTS `youtube` ( \
		`video_id` varchar(12) NOT NULL, \
		`timestamps` varchar(1024) NOT NULL, \
		`types` varchar(512) NOT NULL, \
		`user_id` int(11) NOT NULL, \
		`date` datetime NOT NULL, \
		PRIMARY KEY (`video_id`), \
		UNIQUE KEY `video_id` (`video_id`) \
	   ) ENGINE=InnoDB DEFAULT CHARSET=utf8", (err, result) => {
		if (err) {
			throw new Error(err);
		}
	});

	pool.query("CREATE TABLE IF NOT EXISTS `youtube_pending` ( \
		`pending_id` int(11) NOT NULL AUTO_INCREMENT, \
		`video_id` varchar(12) NOT NULL, \
		`timestamps` varchar(1024) NOT NULL, \
		`types` varchar(512) NOT NULL, \
		`user_id` int(11) NOT NULL, \
		`date` datetime NOT NULL, \
		PRIMARY KEY (`pending_id`) \
	   ) ENGINE=InnoDB DEFAULT CHARSET=utf8", (err, result) => {
		if (err) {
			throw new Error(err);
		}
	});

	pool.query("CREATE TABLE IF NOT EXISTS `_logs` ( \
		`log_id` int(11) NOT NULL AUTO_INCREMENT, \
		`user_id` int(11) NOT NULL, \
		`domain` varchar(256) NOT NULL, \
		`video_id` varchar(256) NOT NULL, \
		`timestamps` varchar(256) NOT NULL, \
		`types` varchar(256) NOT NULL, \
		`date` datetime NOT NULL, \
		PRIMARY KEY (`log_id`) \
	   ) ENGINE=InnoDB DEFAULT CHARSET=utf8", (err, result) => {
		if (err) {
			throw new Error(err);
		}
	});
}