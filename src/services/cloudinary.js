import { v2 as cloudinary } from "cloudinary";

import AppError from "../utils/appError.js";

const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUD_NAME = process.env.CLOUDINARY_NAME;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadImage = async (imagePath) => {
  const options = {
    resource_type: "image",
    use_filename: false,
    unique_filename: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.log("Cloudinary error ", error);
    throw new AppError("Coudn't upload photos try again", 500);
  }
};

const deleteImages = async (imageIds) => {
  try {
    await cloudinary.api.delete_resources(imageIds);
  } catch (error) {
    throw new AppError("Error while deleting resource", 500);
  }
};
const listAssets = async (path) => {
  const assets = await cloudinary.api.resources({
    type: "upload",
    prefix: `realstate/user-${path}`,
  });
  return assets;
};
const deleteOneImage = async (publicId) => {
  const response = await cloudinary.uploader.destroy(publicId);
  return response;
};

export { uploadImage, deleteImages, listAssets, deleteOneImage };
