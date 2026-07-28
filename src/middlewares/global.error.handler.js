import fs from "node:fs";
import multer from "multer";

function globalErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    const folderPath = `uploads/user-${req.user}`;
    fs.rmSync(folderPath, { recursive: true });
    console.log("Folder deleted - ", folderPath);
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "File is too large. Max size is 2mb per file",
        });
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          message:
            "File count exceeds allowed files user can uplod only 10 files",
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: "Invalid file field name.",
        });
      default:
        return res
          .status(400)
          .json({ success: false, message: "File upload failed" });
    }
  }
  if (err.isOperational) {
    console.log("Operational Error - ", err.message);
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }
  console.log("Non operational Error - ", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

export default globalErrorHandler;
