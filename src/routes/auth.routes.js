import { Router } from "express";
const router = Router();
import {
  registerUserRules,
  loginValidation,
  updateValidation,
} from "../middlewares/auth.validator.js";
import {
  registerController,
  loginController,
  logoutController,
  updateUser,
  deleteUser,
  getUser,
} from "../controllers/auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import { userAuth } from "../middlewares/auth.middleware.js";

router.post("/register", registerUserRules, asyncHandler(registerController));
router.post("/login", loginValidation, asyncHandler(loginController));
router.get("/logout", asyncHandler(logoutController));
router.patch("/update", userAuth, updateValidation, asyncHandler(updateUser));
router.delete("/delete", userAuth, asyncHandler(deleteUser));
router.get("/user", userAuth, asyncHandler(getUser));

export default router;
