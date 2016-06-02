window.api = {
	version: "v1",
	nonce: "",
	callbacks: [],
	isReady: false
};

window.api.getNonce = function(callback, err) {
	callback(window.api.nonce);
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

window.api.init = function() {
	$.get(window.page.getBasePath() + "/api/" + window.api.version + "/csrf", function(ret) {
		window.api.isReady = true;
		window.api.nonce = ret.nonce;
		while (window.api.callbacks.length > 0) {
			var func = window.api.callbacks.pop();
			(func)();
		}
	});
};

window.api.ready = function(callback) {
	if (window.api.isReady) {
		callback();
		return;
	}
	window.api.callbacks.push(callback);
};
