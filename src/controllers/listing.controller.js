import fs from "node:fs";

import listingModel from "../models/listing.model.js";
import { deleteImages, uploadImage } from "../services/cloudinary.js";
import AppError from "../utils/appError.js";
import ApiResponse from "../utils/ApiResponse.js";

async function createListing(req, res) {
  const {
    title,
    description,
    price,
    location,
    propertyType,
    bedrooms,
    bathrooms,
    area,
  } = req.body;

  const files = req.files;
  if (0 === files.length) {
    throw new AppError("Photos are required", 401);
  }
  const imageUrls = [];
  for (let i = 0; i < files.length; i++) {
    const result = await uploadImage(`user-${req.user}`, files[i].path);
    imageUrls.push(result);
  }

  const listing = await listingModel.create({
    title,
    description,
    price,
    propertyType,
    bedrooms,
    bathrooms,
    location,
    area,
    propertyOwner: req.user,
    photos: imageUrls,
  });

  fs.rmSync(`uploads/user-${req.user}`, { recursive: true });
  ApiResponse.success(res, "Created new listing", listing, 201);
}
async function updateListing(req, res) {
  const listingId = req.params.listingId.trim();
  const updates = {};
  for (const key in req.body) {
    if (!updates[key]) {
      updates[key] = req.body[key];
    }
  }

  if (!listingId) {
    throw new AppError("Listing id is required", 400);
  } else if (0 === Object.entries(updates).length) {
    throw new AppError("Please send fields and there values to update", 400);
  }
  const updatedListing = await listingModel.findByIdAndUpdate(
    listingId,
    updates,
    {
      returnDocument: "after",
    },
  );
  ApiResponse.success(res, "Updated listing", updatedListing, 200);
}
async function deleteListing(req, res) {
  const listingId = req.params.listingId;
  if (!listingId) {
    throw new AppError("Listing id is required", 401);
  }

  await listingModel.findByIdAndDelete(listingId);
  const path = `realstate/user-${req.user}`;
  await deleteImages(path);
  res.send("OK");
}

export { createListing, updateListing, deleteListing };
