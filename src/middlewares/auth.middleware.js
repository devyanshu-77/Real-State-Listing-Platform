import jwt from "jsonwebtoken";

import AppError from "../utils/appError.js";

const JWT_SECRET = process.env.JWT_SECRET;

async function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    throw new AppError(
      "Authentication token is missing. Please provide a valid token.",
      401,
    );
  }
  const decoded = jwt.verify(token, JWT_SECRET);
  if (decoded.role !== "property_owner") {
    throw new AppError("Unauthorized", 403);
  }
  next();
}

export default authMiddleware;
