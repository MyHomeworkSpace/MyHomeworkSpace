module.exports = {
	dbConnection: {
		host     : 'localhost',
		user     : 'planhub',
		password : 'planhub',
		database : 'planhub'},
	emails: {
		enabled: false,
		from: "Misconfigured PlanHub <misconfigured@misconfigured.invalid>",
		smtpConfig: {
			host: "localhost",
			port: 465,
			secure: true
			auth: {
				user: "accounts@planhub.me",
				pass: "password"
			}
		}
	}
};
