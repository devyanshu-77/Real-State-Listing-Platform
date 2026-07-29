import jwt from "jsonwebtoken";

import AppError from "../utils/appError.js";

const JWT_SECRET = process.env.JWT_SECRET;

async function propertyOwnerAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    throw new AppError(
      "Authentication token is missing. Please provide a valid token.",
      401,
    );
  }
  const decoded = jwt.verify(token, JWT_SECRET);
  if (decoded.role !== "property_owner") {
    throw new AppError(
      "Unauthorized only property owners can create listings",
      403,
    );
  }
  req.user = decoded.id;
  next();
}

export { propertyOwnerAuth };
