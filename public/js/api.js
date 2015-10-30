window.api = {
	version: "v1"
};

window.api.getNonce = function(callback, err) {
	$.get(window.page.getBasePath() + "/api/" + window.api.version + "/csrf", function(ret) {
		callback(ret.nonce);
	});
};

window.api.get = function(path, done, err) {
	window.api.getNonce(function(nonce) {
		$.get(window.page.getBasePath() + "/api/" + window.api.version + "/" + path, { nonce: nonce }, function(ret) {
			done(ret);
		});
	}, err);
};

window.api.post = function(path, data, done, err) {
	window.api.getNonce(function(nonce) {
		var sendData = data;
		sendData.nonce = nonce;
		$.post(window.page.getBasePath() + "/api/" + window.api.version + "/" + path, sendData, function(ret) {
			done(ret);
		});
	}, err);
};