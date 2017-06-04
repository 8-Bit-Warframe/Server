const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.profileRead = function(req, res) {
	if (req.payload._id) {
		User.findById(req.payload._id).exec(function(err, user) {
			res.status(200).json(user);
		});
	} else {
		res.status(401).json({
			'message': 'Unauthorised'
		});
	}
};