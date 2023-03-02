import express from "express";
const router = express.Router();

import admin from "../controllers/admin.controller.js";
import adminAuthentication from "../controllers/adminAuthentication.controller.js";
import adminAuthenticationMiddleware from "../middlewares/adminAuthentication.js";
import operatorAuthenticationMiddleware from "../middlewares/operatorAuthentication.js";

router.get("/refresh", adminAuthentication.resetAccessToken);
router.get("/", adminAuthenticationMiddleware, admin.viewDashboard);
router.get("/op", [adminAuthenticationMiddleware, operatorAuthenticationMiddleware], admin.viewOperatorDashboard);

export default router;