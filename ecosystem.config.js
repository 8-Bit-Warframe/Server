module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		{
			name: 'backend',
			script: 'backend/dist/server.js',
			watch: ['backend'],
			env_production: {
				NODE_ENV: 'production'
			}
		},

		{
			name: 'matchmaking',
			script: 'matchmaking/javascript/server.js',
			watch: ['matchmaking'],
			env_production: {
				NODE_ENV: 'production'
			}
		}
	],

	/**
	 * Deployment section
	 * http://pm2.keymetrics.io/docs/usage/deployment/
	 */
	deploy: {
		production: {
			key: 'E:/Keys/8bitwarframe.com/node/private_openssh',
			user: 'node',
			host: '178.62.33.251',
			ref: 'origin/master',
			repo: 'git@github.com:8-Bit-Warframe/Server.git',
			path: '/var/www/production',
			'post-deploy': 'npm install && ng build -prod && pm2 reload ecosystem.config.js --env production'
		},
		dev: {
			key: 'E:/Keys/8bitwarframe.com/node/private_openssh',
			user: 'node',
			host: '178.62.33.251',
			ref: 'origin/master',
			repo: 'git@github.com:8-Bit-Warframe/Server.git',
			path: '/var/www/development',
			'post-deploy': 'chmod 777 ./install-dev.sh && ./install-dev.sh',
			env: {
				NODE_ENV: 'dev'
			}
		}
	}
};
