const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");

const customer = require("../controllers/customer.controller");
const customerAuthentication = require("../controllers/customerAuthentication.controller");
const adminAuthentication = require("../controllers/adminAuthentication.controller");
const customerRegistrationMiddleware = require("../middlewares/customerRegistration");
const customerAuthenticationMiddleware = require("../middlewares/customerAuthentication");

router.use(errorHandler);
router.get("/", customer.viewAll);
router.post("/signup", customerRegistrationMiddleware, customerAuthentication.sendVerificationEmail);
router.post("/signup/verify", customerAuthentication.validateCode);
router.post("/login", customerAuthentication.grabTokens);
router.post("/refresh", customerAuthentication.resetAccessToken);
router.post("/my-account", customerAuthenticationMiddleware, customer.viewAccount);
router.post("/my-projects", customerAuthenticationMiddleware, customer.viewProjects);
router.get("/admin-login", adminAuthentication.loadAdminLoginPage);
router.post("/admin-login", adminAuthentication.grabTokens);

module.exports = router;