import express from "express";
import {
  loginUserHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerUserHandler,
  verifyEmailHandler,
  resendVerifyHandler,
  forgotPasswordHandler,
  updatePasswordHandler,
} from "../controllers/auth.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import {
  createUserSchema,
  loginUserSchema,
  verifyEmailSchema,
  ForgotPasswordSchema,
  UpdatePasswordSchema,
} from "../schemas/user.schema";
import {
  registerLimiter,
  loginLimiter,
  emailResendLimiter,
  forgotPasswordLimiter,
  updatePasswordLimiter,
} from "../middleware/limiter";

const router = express.Router();

// Register user
router.post(
  "/register",
  registerLimiter,
  validate(createUserSchema),
  registerUserHandler
);

// Login user
router.post(
  "/login",
  loginLimiter,
  validate(loginUserSchema),
  loginUserHandler
);

// Logout user
router.get("/logout", deserializeUser, requireUser, logoutHandler);

// Refresh access token
router.get("/refresh", refreshAccessTokenHandler);

//Resend verification email
router.post(
  "/emailresend",
  emailResendLimiter,
  validate(ForgotPasswordSchema),
  resendVerifyHandler
);

//Get Update Password code
router.post(
  "/forgotpass",
  forgotPasswordLimiter,
  validate(ForgotPasswordSchema),
  forgotPasswordHandler
);

//Update Password
router.post(
  "/updatepassword",
  updatePasswordLimiter,
  validate(UpdatePasswordSchema),
  updatePasswordHandler
);

// Verify Email Address
router.get(
  "/verifyemail/:verificationCode",
  validate(verifyEmailSchema),
  verifyEmailHandler
);

export default router;
