module.exports = function (pathnames, writer) {
	(function next(i, len) {
		if (i < len) {
			var reader = fs.createReadStream(pathnames[i]);

			reader.pipe(writer, { end: false });
			reader.on("end", function () {
				next(i + 1, len);
			});
		} else {
			writer.end();
		}
	})(0, pathnames.length);
};
