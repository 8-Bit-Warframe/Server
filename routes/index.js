const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = jwt({
  secret: process.env.JWT_SECRET
});

const ctrlProfile = require('../controllers/profile');
const ctrlAuth = require('../controllers/authentication');

router.get('/profile', auth, ctrlProfile.profileRead);

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
