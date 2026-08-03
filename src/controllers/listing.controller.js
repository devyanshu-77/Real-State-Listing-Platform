import fs from "node:fs";

import listingModel from "../models/listing.model.js";
import userModel from "../models/user.model.js";
import {
  deleteImages,
  uploadImage,
  deleteOneImage,
} from "../services/cloudinary.js";
import AppError from "../utils/appError.js";
import ApiResponse from "../utils/ApiResponse.js";

async function createListing(req, res) {
  if (req.user.role !== "property_owner") {
    return ApiResponse.error(
      res,
      "Only property owner can create listings",
      null,
      400,
    );
  }
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
    const result = await uploadImage(files[i].path);
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
    propertyOwner: req.user.id,
    photos: imageUrls,
  });

  fs.rmSync(`uploads/user-${req.user.id}`, { recursive: true });
  ApiResponse.success(res, "Created new listing", listing, 201);
}
async function updateListing(req, res) {
  if (req.user.role !== "property_owner") {
    return ApiResponse.error(
      res,
      "Only property owner can update a listing",
      null,
      400,
    );
  }
  const listingId = req.params.listingId.trim();
  const updates = {};
  for (const key in req.body) {
    if (!updates[key] && req.body[key]) {
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
  if (req.user.role !== "property_owner") {
    return ApiResponse.error(
      res,
      "Only property owner can delete a listing",
      null,
      400,
    );
  }
  const listingId = req.params.listingId;
  if (!listingId) {
    throw new AppError("Listing id is required", 401);
  }

  const listing = await listingModel.findOneAndDelete({
    _id: listingId,
    propertyOwner: req.user.id,
  });
  if (!listing) {
    throw new AppError("Listing doesn't exist", 404);
  }
  const imageIds = listing.photos.map((l) => l.publicId);
  await deleteImages(imageIds);
  ApiResponse.success(res, "Listing deleted successfully", null, 200);
}
async function deleteListingImage(req, res) {
  if (req.user.role !== "property_owner") {
    return ApiResponse.error(
      res,
      "Only property owner can delete a listing",
      null,
      400,
    );
  }
  try {
    const { listingId, publicId } = req.params;
    const listing = await listingModel.findOne({
      _id: listingId,
      propertyOwner: req.user.id,
    });

    if (!listing) {
      return ApiResponse.error(
        res,
        "Invalid id listing does not exist!",
        null,
        400,
      );
    }
    if (2 >= listing.photos.length) {
      return AppError(
        res,
        "Please add photos before deleting existing one",
        null,
        401,
      );
    }
    await deleteOneImage(publicId);
    const updates = listing.photos.filter((l) => l.publicId !== publicId);
    await listingModel.findOneAndUpdate(
      { _id: listingId },
      {
        photos: updates,
      },
    );
    ApiResponse.success(res, "Deleted image from listing", 200);
  } catch (err) {
    console.log("Listing image deletion failed ", err);
    throw new Error("Something went wrong while deleting listing image");
  }
}
async function addListingImage(req, res) {
  if (req.user.role !== "property_owner") {
    return ApiResponse.error(
      res,
      "Only property owner can delete a listing",
      null,
      400,
    );
  }
  const listingId = req.params.listingId;
  const files = req.files;
  if (0 === files.length) {
    return ApiResponse.error(res, "Please send images to add", null, 400);
  }
  const listing = await listingModel.findOne({
    _id: listingId,
    propertyOwner: req.user.id,
  });
  if (!listing) {
    return ApiResponse.success(res, "No listing exist with such id", null, 400);
  }

  if (10 < files.length + listing.photos.length) {
    const removeCount = 10 - files.length;
    return ApiResponse.error(
      res,
      `You can add only 10 images remove ${removeCount}`,
      null,
      400,
    );
  }

  const images = [];
  for (let i = 0; i < files.length; i++) {
    const result = await uploadImage(files[i].path);
    images.push({ url: result.secure_url, publicId: result.publicId });
  }
  const photos = listing.photos;
  const updatedPhotos = [...photos, ...images];
  const updatedListing = await listingModel.findOne(
    { _id: listingId },
    {
      photos: updatedPhotos,
    },
  );

  res.send(updatedListing);
}
async function getAllListings(req, res) {
  if (req.user.role !== "property_owner") {
    return ApiResponse.error(
      res,
      "Only property owner can delete a listing",
      null,
      400,
    );
  }
  const user = await userModel.findById(req.user.id);
  if (!user) {
    res.clearCookie("token");
    return ApiResponse.error(res, "Unauthorized", null, 400);
  }

  const listings = await listingModel.find({ propertyOwner: user._id });
  ApiResponse.success(res, "Fetched all listings", { listings }, 200);
}

export {
  createListing,
  updateListing,
  deleteListing,
  deleteListingImage,
  addListingImage,
  getAllListings,
};
