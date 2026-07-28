import { Router } from "express";
const router = Router();

import authMiddleware from "../middlewares/auth.middleware.js";
import { createListingValidation } from "../middlewares/listing.validator.js";
import { createListing } from "../controllers/listing.controller.js";
import upload from "../middlewares/multer.middleware.js";

router.post(
  "/listing",
  authMiddleware,
  upload.array("photos"),
  createListingValidation,
  createListing,
);

export default router;
