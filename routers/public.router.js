const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customer.controller');
const homeController = require('../controllers/home.controller');
const adminAuthenticationController = require('../controllers/adminAuthentication.controller');


router.get('/', homeController.viewAll);

router.get('/admin-login', adminAuthenticationController.loadAdminLoginPage);

router.post('/admin-login', adminAuthenticationController.grabAdminTokens);



module.exports = router;