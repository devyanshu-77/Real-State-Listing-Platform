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

const uploadImage = async (subFolder, imagePath) => {
  const options = {
    resource_type: "image",
    folder: `realstate/${subFolder}`,
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result.secure_url;
  } catch (error) {
    console.log("Cloudinary error ", error);
    throw new AppError("Coudn't upload photos try again", 500);
  }
};

const deleteImages = async (folderPath) => {
  try {
    const deleteResources = await cloudinary.api.delete_resources_by_prefix(
      `${folderPath}/`,
    );

    const deleteFolderResult = await cloudinary.api.delete_folder(folderPath);

    return deleteFolderResult;
  } catch (error) {
    if (error.error.http_code === 404) {
      throw new AppError("Resource doesn't exist", 404);
    }
    throw new AppError("Error while deleting resource", 500);
  }
};

export { uploadImage, deleteImages };
