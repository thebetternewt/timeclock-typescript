module.exports = {
	apps: [
		{
			name: 'timeclock-server',
			script: 'src/index.ts',

			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				NODE_ENV: 'development',
				SESS_NAME: 'tsid',
				SESS_SECRET: 'mysecret123!',
				SESS_LIFETIME: 1000 * 60 * 60, // 1 hour
			},
			env_production: {
				NODE_ENV: 'production',
				SESS_NAME: 'tsid',
				SESS_SECRET: 'mysecret123!',
				SESS_LIFETIME: 1000 * 60 * 2, // 2 minutes
				CAS_HOST: 'cas.my.university.edu',
				CAS_SERVICE_VALIDATE: '/cas/serviceValidate',
				CAS_LOGIN: '/cas/login',
			},
		},
	],

	// deploy : {
	//   production : {
	//     user : 'node',
	//     host : '212.83.163.1',
	//     ref  : 'origin/master',
	//     repo : 'git@github.com:repo.git',
	//     path : '/var/www/production',
	//     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
	//   }
	// }
};
