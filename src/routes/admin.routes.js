import { Router } from "express";
import { registerAdminValidation } from "../middlewares/admin.validator.js";
import {
  getAllListings,
  registerAdmin,
} from "../controllers/admin.controller.js";
import { userAuth } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/register", userAuth, registerAdminValidation, registerAdmin);
router.delete(
  "/listing/:listingId",
  userAuth,
  registerAdminValidation,
  registerAdmin,
);
router.get("/listings", userAuth, getAllListings);

export default router;
