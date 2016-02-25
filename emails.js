var emailTemplates = {
	verify: {
		subject: "Verify your email",
		html: '<h1>PlanHub</h1><h2>Verify your email</h2><p>TODO: some text here I guess</p><a href="(verify_url)">Click here to verify your email</a><p>If that didn\'nt work, try copy-pasting the following URL into a new browser window: (verify_url)</p>',
		text: 'PlanHub\nVerify your email\nTODO: some text here I guess\nCopy-paste the following URL into a new browser window: (verify_url)'
	}
};

var processTemplate = function(text, objs) {
	var out = text;
	for (var objIndex in objs) {
		var obj = objs[objIndex];
		out = out.replace("(" + objIndex + ")", obj);
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
