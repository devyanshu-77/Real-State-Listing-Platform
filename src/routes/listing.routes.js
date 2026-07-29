import { Router } from "express";
const router = Router();

import { propertyOwnerAuth } from "../middlewares/auth.middleware.js";
import {
  createListingValidation,
  updateListingValidation,
} from "../middlewares/listing.validator.js";
import {
  createListing,
  updateListing,
} from "../controllers/listing.controller.js";
import upload from "../middlewares/multer.middleware.js";

router.post(
  "/listing",
  propertyOwnerAuth,
  upload.array("photos"),
  createListingValidation,
  createListing,
);

router.patch(
  "/listing/:listingId",
  propertyOwnerAuth,
  updateListingValidation,
  updateListing,
);

export default router;
