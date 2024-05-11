var fs = require("fs");

module.exports = function validateFiles(pathnames, callback) {
	(function next(i, len) {
		if (i < len) {
			fs.stat(pathnames[i], function (err, stats) {
				if (err) {
					callback(err);
				} else if (!stats.isFile()) {
					callback(new Error());
				} else {
					next(i + 1, len);
				}
			});
		} else {
			callback(null, pathnames);
		}
	})(0, pathnames.length);
};
