import { Router } from "express";
const router = Router();

import { userAuth } from "../middlewares/auth.middleware.js";
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
  getOwnerAllListings,
} from "../controllers/listing.controller.js";
import upload from "../middlewares/multer.middleware.js";

router.post(
  "/listing",
  userAuth,
  upload.array("photos"),
  createListingValidation,
  createListing,
);
router.patch(
  "/listing/:listingId",
  userAuth,
  updateListingValidation,
  updateListing,
);
router.delete("/listing/:listingId", userAuth, deleteListing);
router.delete("/image/:listingId/:publicId", userAuth, deleteListingImage);

router.post(
  "/image/:listingId",
  userAuth,
  upload.array("photos"),
  addListingImage,
);

router.get("/owners/listings", userAuth, getOwnerAllListings);
router.get("/listings", getOwnerAllListings);

export default router;
