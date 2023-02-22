const express = require("express");
const router = express.Router();

const adminAuthenticationController = require("../controllers/adminAuthentication.controller");
const adminController = require("../controllers/admin.controller");

const adminAuthenticationMiddleware = require("../middlewares/adminAuthentication");
const operatorAuthenticationMiddleware = require("../middlewares/operatorAuthentication");

router.get("/refresh", adminAuthenticationController.resetAdminAccessToken);

router.get("/", adminAuthenticationMiddleware, adminController.dashboard);

router.get("/op", [adminAuthenticationMiddleware, operatorAuthenticationMiddleware], adminController.operatorDashboard);

module.exports = router;