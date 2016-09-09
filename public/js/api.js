window.api = {
	version: "v1",
	token: "",
	callbacks: [],
	isReady: false
};

window.api.get = function(path, done, err) {
	$.get(window.api.path + path + "?csrfToken=" + window.api.token, function(ret) {
		done(ret);
	});
};

window.api.post = function(path, data, done, err) {
	$.post(window.api.path + path + "?csrfToken=" + window.api.token, data, function(ret) {
		done(ret);
	});
};

window.api.init = function() {
	window.api.path = window.location.protocol + "//api-v2." + window.location.hostname + "/";
	$.ajaxSetup({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true
	});
	$.get(window.api.path + "auth/csrf", function(ret) {
		$.get(window.api.path + "auth/csrf", function(ret) {
			window.api.token = ret.token;
			window.api.isReady = true;
			while (window.api.callbacks.length > 0) {
				var func = window.api.callbacks.pop();
				(func)();
			}
		});
	});
};

window.api.ready = function(callback) {
	if (window.api.isReady) {
		callback();
		return;
	}
	window.api.callbacks.push(callback);
};
