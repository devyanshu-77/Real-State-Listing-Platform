import fs from "node:fs";

import listingModel from "../models/listing.model.js";
import uploadImage from "../services/cloudinary.js";
import AppError from "../utils/appError.js";

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
    const result = await uploadImage("user-test-1", files[i].path);
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
  res
    .status(201)
    .json({ success: true, message: "Created new listing", data: { listing } });
}

export { createListing };
