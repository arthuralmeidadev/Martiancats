// OLD

const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authentication.controller');

router.post('/login',  authenticationController.grabTokens);

router.get('/refresh', authenticationController.getNewAccessToken);

module.exports = router;