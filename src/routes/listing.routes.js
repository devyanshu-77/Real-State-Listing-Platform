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
  deleteListing,
  deleteListingImage,
  addListingImage,
  getAllListings,
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
router.delete("/listing/:listingId", propertyOwnerAuth, deleteListing);
router.delete(
  "/image/:listingId/:publicId",
  propertyOwnerAuth,
  deleteListingImage,
);

router.post(
  "/image/:listingId",
  propertyOwnerAuth,
  upload.array("photos"),
  addListingImage,
);

router.get("/listings", propertyOwnerAuth, getAllListings);

export default router;
