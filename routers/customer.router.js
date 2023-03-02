import express from "express";

// Controllers
import customer from "../controllers/customer.controller.js";
import customerAuthentication from "../controllers/customerAuthentication.controller.js";
import adminAuthentication from "../controllers/adminAuthentication.controller.js";

// Middlewares
import customerRegistrationMiddleware from "../middlewares/customerRegistration.js";
import customerAuthenticationMiddleware from "../middlewares/customerAuthentication.js";

const router = express.Router();

router.get("/", customer.viewAll);
router.post("/signup", customerRegistrationMiddleware, customerAuthentication.sendVerificationEmail);
router.post("/signup/verify", customerAuthentication.validateCode);
router.post("/login", customerAuthentication.grabTokens);
router.post("/refresh", customerAuthentication.resetAccessToken);
router.post("/my-account", customerAuthenticationMiddleware, customer.viewAccount);
router.post("/my-projects", customerAuthenticationMiddleware, customer.viewProjects);
router.get("/admin-login", adminAuthentication.loadAdminLoginPage);
router.post("/admin-login", adminAuthentication.grabTokens);

export default router;