var emailTemplates = {
	verify: {
		subject: "Verify your email",
		html: '<h1>MyHomeworkSpace</h1><h2>Verify your email</h2><p>TODO: some text here I guess</p><a href="(verify_url)">Click here to verify your email</a><p>If that didn\'t work, try copy-pasting the following URL into a new browser window: (verify_url)</p>',
		text: 'MyHomeworkSpace\nVerify your email\nTODO: some text here I guess\nCopy-paste the following URL into a new browser window: (verify_url)'
	},
	smsCode: {
		subject: "",
		// this is an SMS message, so please keep `html` and `text` the *same*
		html: "(verify_code) is your MyHomeworkSpace verification code. You should make me a contact so you don't think some random person is texting you about your homework!",
		text: "(verify_code) is your MyHomeworkSpace verification code. You should make me a contact so you don't think some random person is texting you about your homework!"
	},
	smsNotification1: {
		subject: "",
		// this is an SMS message, so please keep `html` and `text` the *same*
		html: "You asked me to remind you about your (assignment_type) in (subject_name), so here is your reminder:",
		text: "You asked me to remind you about your (assignment_type) in (subject_name), so here is your reminder:"
	}
	smsNotification2: {
		subject: "",
		// this is an SMS message, so please keep `html` and `text` the *same*
		html: "(assignment_name) is due (due_date)",
		text: "(assignment_name) is due (due_date)"
	}
};

var processTemplate = function(text, objs) {
	var out = text;
	for (var objIndex in objs) {
		var obj = objs[objIndex];
		out = out.replace(new RegExp("\\(" + objIndex.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1") + "\\)", "g"), obj);
	}
	return out;
};

var sendEmail = function(templateName, to, templateObjs, done, err) {
	var template = emailTemplates[templateName];
	var html = processTemplate(template.html, templateObjs);
	var text = processTemplate(template.text, templateObjs);
	var emailObj = {
		from: config.emails.from,
		to: to,
		subject: template.subject,
		text: text,
		html: html
	};
	transporter.sendMail(emailObj, function(err, info) {
		if (err) {
			err(err);
			return;
		}
		done(info);
	});
};

module.exports = {
	sendEmail: sendEmail
};
