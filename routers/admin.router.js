const express = require("express");
const router = express.Router();

const admin = require("../controllers/admin.controller");
const adminAuthentication = require("../controllers/adminAuthentication.controller");
const adminAuthenticationMiddleware = require("../middlewares/adminAuthentication");
const operatorAuthenticationMiddleware = require("../middlewares/operatorAuthentication");

router.get("/refresh", adminAuthentication.resetAccessToken);
router.get("/", adminAuthenticationMiddleware, admin.viewDashboard);
router.get("/op", [adminAuthenticationMiddleware, operatorAuthenticationMiddleware], admin.viewOperatorDashboard);

module.exports = router;