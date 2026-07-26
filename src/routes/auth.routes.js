import { Router } from "express";
const router = Router();
import {
  registerUserRules,
  loginValidation,
} from "../middlewares/auth.validator.js";
import {
  registerController,
  loginController,
} from "../controllers/auth.controller.js";

router.post("/register", registerUserRules, registerController);
router.post("/login", loginValidation, loginController);

export default router;
