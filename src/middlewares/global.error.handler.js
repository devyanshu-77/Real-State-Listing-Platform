import fs from "node:fs";
import multer from "multer";
import ApiResponse from "../utils/ApiResponse.js";

function globalErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    const folderPath = `uploads/user-${req.user}`;
    fs.rmSync(folderPath, { recursive: true });
    console.log("Folder deleted - ", folderPath);
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return ApiResponse.error(
          res,
          "File is too large. Max size is 2mb per file",
          null,
          400,
        );
      case "LIMIT_FILE_COUNT":
        return ApiResponse.error(
          res,
          "File count exceeds allowed files user can uplod only 10 files",
          null,
          400,
        );
      case "LIMIT_UNEXPECTED_FILE":
        return ApiResponse.error(res, "Invalid file field name.", null, 400);
      default:
        return ApiResponse.error(res, "File upload failed", null, 400);
    }
  }
  if (err.isOperational) {
    console.log("Operational Error - ", err.message);
    return ApiResponse.error(res, err.message, null, err.statusCode);
  }
  console.log("Non operational Error - ", err);
  ApiResponse.error(res, "Internal Server error", null, 500);
}

export default globalErrorHandler;
