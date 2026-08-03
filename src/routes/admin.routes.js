import { Router } from "express";
const router = Router();

import { registerAdminValidation } from "../middlewares/admin.validator.js";
import {
  changeListingStatus,
  registerAdmin,
} from "../controllers/admin.controller.js";
import { userAuth } from "../middlewares/auth.middleware.js";
import { changeStatusValidation } from "../middlewares/admin.validator.js";

router.post("/register", userAuth, registerAdminValidation, registerAdmin);
router.delete(
  "/listing/:listingId",
  userAuth,
  registerAdminValidation,
  registerAdmin,
);
router.patch(
  "/status/:listingId",
  userAuth,
  changeStatusValidation,
  changeListingStatus,
);

export default router;
