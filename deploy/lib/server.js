var fs = require("fs"),
	path = require("path"),
	http = require("http");

var outputFiles = require("./file_resolver/outputFiles");
var validateFiles = require("./file_resolver/validateFiles");

var MIME = {
	".css": "text/css",
	".js": "application/javascript",
};

function combineFiles(pathnames, callback) {
	var output = [];
	(function next(i, len) {
		if (i < len) {
			fs.readFile(pathnames[i], function (err, data) {
				if (err) {
					callback(err);
				} else {
					output.push(data);
					next(i + 1, len);
				}
			});
		} else {
			callback(null, Buffer.concat(output));
		}
	})(0, pathnames.length);
}

function main(argv) {
	var config = JSON.parse(fs.readFileSync(argv[0], "utf-8")),
		root = config.root || ".",
		port = config.port || 80,
		server;

	server = http
		.createServer(function (request, response) {
			var urlInfo = parseURL(root, request.url);

			validateFiles(urlInfo.pathnames, function (err, pathnames) {
				if (err) {
					response.writeHead(404);
					response.end(err.message);
				} else {
					response.writeHead(200, {
						"Content-Type": urlInfo.mine,
					});
					outputFiles(pathnames, response);
				}
			});

			// combineFiles(urlInfo.pathnames, function (err, data) {
			// 	if (err) {
			// 		response.writeHead(404);
			// 		response.end(err.message);
			// 	} else {
			// 		response.writeHead(200, {
			// 			"Content-Type": urlInfo.mime,
			// 		});
			// 		response.end(data);
			// 	}
			// });
		})
		.listen(port);

	process.on("SIGTERM", function () {
		server.close(function () {
			process.exit(0);
		});
	});
}

function parseURL(root, url) {
	var base, pathnames, parts;
	// 检查URL是否包含 '??' 分隔符，如果没有，则将 '/' 替换为 '/??'
	// 这是为了方便处理请求的URL，确保都是合并文件的格式。
	if (url.indexOf("??") === -1) {
		url = url.replace("/", "/??");
	}

	// 将URL分割为两部分，其中`parts[0]`是基础路径，`parts[1]`含有要合并文件的部分。
	parts = url.split("??");
	base = parts[0];
	// 假设parts[1]是 "file1.js,file2.js"，
	// 使用split(',')将文件名分隔为数组 ['file1.js', 'file2.js']，
	// 然后通过map将每个文件名与基础路径和根目录结合，
	// 生成实际文件系统中的绝对路径数组。
	pathnames = parts[1].split(",").map(function (value) {
		return path.join(root, base, value);
	});

	return {
		mime: MIME[path.extname(pathnames[0])] || "text/plain",
		pathnames,
	};
}

main(process.argv.slice(2));
