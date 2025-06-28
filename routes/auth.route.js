import { Router } from "express";
import * as authService from "../services/auth/auth.services.js";
import asyncHandler from "../utils/asyncHandler.js";
import validationMiddleware from "../middlewares/validation.js";
import authRules, { loginRules } from "../services/auth/auth.validation.js";
import limiter from "../utils/rateLimiter.js";

const router = Router();

router
  .route("/register")
  .post(
    authRules.register,
    validationMiddleware,
    asyncHandler(authService.register)
  );

router
  .route("/login")
  .post(loginRules, validationMiddleware, asyncHandler(authService.login));

router.route("/forgotPassword").post(limiter, authService.forgotPassword);
router.route("/verifyOTP").post(
  asyncHandler(authService.verifyOTP)
);
router.route("/resetPassword").post(
  asyncHandler(authService.resetPassword)
);

export default router;
