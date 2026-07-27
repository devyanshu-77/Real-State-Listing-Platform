import { Router } from "express";
const router = Router();
import multer from "multer";
const upload = multer();

import authMiddleware from "../middlewares/auth.middleware.js";
import { createListingValidation } from "../middlewares/listing.validator.js";
import { createListing } from "../controllers/listing.controller.js";

router.post(
  "/listing",
  authMiddleware,
  upload.array("photos", 10),
  createListingValidation,
  createListing,
);

export default router;
