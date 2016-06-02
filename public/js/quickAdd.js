window.quickAdd = {
	subjects: [],
	init: function() {
		window.api.get("planner/sections/get/", function(data) {
			for (var i = 0; i < data.sections.length; i++) {
				var itm = data.sections[i];
				window.quickAdd.subjects.push(itm.name.toLowerCase());
			}
		});
	},
	open: function() {

	},
	parseText: function(text) {
		var prefixes = window.utils.getPrefixes();
		var flatPrefixes = window.utils.getFlatPrefixes();
		var retObj = {
			what: undefined,
			tag: undefined,
			subject: undefined,
			due: undefined
		};
		var nlp = window.nlp_compromise;
		var terms = nlp.sentence(text).terms;

		for (var termIndex in terms) {
			var term = terms[termIndex];
			if (flatPrefixes.indexOf(term.text.toLowerCase()) > -1) {
				retObj.tag = term.text;
			}
			if (window.quickAdd.subjects.indexOf(term.text.toLowerCase()) > -1) {
				retObj.subject = term.text;
			}
			if (term.tag == "Date") {
				retObj.due = term.text;
			}
		}

		return retObj;
	}
};

window.api.ready(function() {
	window.quickAdd.init();
});
