
const express = require('express');
const router = express.Router();

const {login, refreshAccessToken, signup} = require("../controllers/auth")

router.post('/login', login);
router.post('/signup', signup)
router.post('/refresh-access-token', refreshAccessToken)

module.exports = router;