module.exports = {
	basePath: "/",
	staticPath: "/static",
	dbConnection: {
		host     : 'localhost',
		user     : 'myhomeworkspace',
		password : 'myhomeworkspace',
		database : 'myhomeworkspace'},
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
