import { Router } from "express";
const router = Router();
import { registerUserRules } from "../middlewares/auth.validator.js";
import { registerController } from "../controllers/auth.controller.js";

router.post("/register", registerUserRules, registerController);

export default router;
