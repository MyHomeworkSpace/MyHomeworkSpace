window.api = {
	version: "v1",
	noncePool: [],
	noncePooling: true
};

window.api.addToNoncePool = function(callback) {
	if (!noncePooling) {
		return;
	}
	$.get(window.page.getBasePath() + "/api/" + window.api.version + "/csrfPool", function(ret) {
		// add them to the pool
		for (var nonceIndex in ret.nonces) {
			noncePool.push(ret.nonces[nonceIndex]);
		}
		callback();
	});
};

window.api.getNonce = function(callback, err) {
	if (noncePooling) {
		if (noncePool.length > 0) {
			// that was easy
			callback(noncePool.pop());
		} else {

		}
	}
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
