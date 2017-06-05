const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const sendJsonResponse = function(res, status, content) {
	res.status(status).json(content);
};

module.exports.register = function(req, res) {
	if (!req.body.rAlias || !req.body.rEmail || !req.body.rPassword || !req.body.rConfirmPassword) {
		sendJsonResponse(res, 422, {message: 'All fields must be filled in'});
		return;
	}
	if (req.body.rPassword !== req.body.rConfirmPassword) {
		sendJsonResponse(res, 422, {message: 'Passwords must match'});
		return;
	}

	const user = new User();

	user.alias = req.body.rAlias;
	user.email = req.body.rEmail;
	user.setPassword(req.body.password);

	user.save(function() {
		const token = user.generateJwt();
		sendJsonResponse(res, 200, {
			'token': token
		});
	});
};

module.exports.login = function(req, res) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			sendJsonResponse(res, 404, err);
			return;
		}
		if (user) {
			const token = user.generateJwt();
			sendJsonResponse(res, 200, {
				'token': token
			});
		} else {
			sendJsonResponse(res, 401, info);
		}
	})(req, res);
};
