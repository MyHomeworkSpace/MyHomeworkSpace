window.api = {
	version: "v1"
};

window.api.get = function(path, done, err) {
	$.get(window.page.getBasePath() + "/api/" + window.api.version + "/" + path, function(ret) {
		done(ret);
	});
};

window.api.post = function(path, data, done, err) {
	$.post(window.page.getBasePath() + "/api/" + window.api.version + "/" + path, data, function(ret) {
		done(ret);
	});
};