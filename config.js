module.exports = {
	basePath: "/",
	staticPath: "/static",
	dbConnection: {
		host     : '192.168.0.20',
		user     : 'planhub_test',
		password : 'planhub_test',
		database : 'planhub_test'},
	emails: {
		enabled: false,
		from: "Misconfigured MyHomeworkSpace <misconfigured@misconfigured.invalid>",
		smtpConfig: {
			host: "localhost",
			port: 465,
			secure: true,
			auth: {
				user: "accounts@myhomework.space",
				pass: "password"
			}
		}
	}
};
