import { Router } from "express";
const router = Router();
import {
  registerUserRules,
  loginValidation,
} from "../middlewares/auth.validator.js";
import {
  registerController,
  loginController,
  logoutController,
} from "../controllers/auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

router.post("/register", registerUserRules, asyncHandler(registerController));
router.post("/login", loginValidation, asyncHandler(loginController));
router.get("/logout", asyncHandler(logoutController));

export default router;
