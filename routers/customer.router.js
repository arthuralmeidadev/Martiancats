const express = require("express");
const router = express.Router();

const homeController = require("../controllers/home.controller");
const customerAuthenticationController = require("../controllers/customerAuthentication.controller");
const adminAuthenticationController = require("../controllers/adminAuthentication.controller");

router.get("/", homeController.viewAll);

// needs a middleware to prevent duplicates
router.post("/signup", customerAuthenticationController.sendVerificationEmail);

router.post("/signup/verify", customerAuthenticationController.validateCode);

router.get("/admin-login", adminAuthenticationController.loadAdminLoginPage);

router.post("/admin-login", adminAuthenticationController.grabAdminTokens);


module.exports = router;