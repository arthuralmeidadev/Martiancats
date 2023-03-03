import express from "express";

// Controllers
import admin from "../controllers/admin.controller.js";
import adminAuthentication from "../controllers/adminAuthentication.controller.js";

// Middlewares
import adminAuthenticationMiddleware from "../middlewares/adminAuthentication.js";
import operatorAuthenticationMiddleware from "../middlewares/operatorAuthentication.js";

const router = express.Router();

router.get("/refresh", adminAuthentication.resetAccessToken);
router.get("/", adminAuthenticationMiddleware, admin.viewDashboard);
router.get("/op", [adminAuthenticationMiddleware, operatorAuthenticationMiddleware], admin.viewOperatorDashboard);

export default router;