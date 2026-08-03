import fs from "node:fs";
import multer from "multer";
import AppError from "../utils/appError.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = `uploads/user-${req.user.id}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log("Created folder - ", folderPath);
    }
    cb(null, `uploads/user-${req.user.id}`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new AppError("File type is not allowed", 401);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 10,
  },
});

export default upload;
