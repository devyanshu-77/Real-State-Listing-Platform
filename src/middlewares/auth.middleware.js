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
      "Unauthorized only property owners have access to listings",
      403,
    );
  }
  req.user = decoded.id;
  next();
}

async function userAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    throw new AppError(
      "Authentication token is missing. Please provide a valid token.",
      401,
    );
  }
  const decoded = jwt.verify(token, JWT_SECRET);
  const roles = ["admin", "buyer", "property_owner"];
  if (!roles.includes(decoded.role)) {
    throw new AppError("Unauthorized", 403);
  }
  req.user = decoded.id;
  next();
}

export { propertyOwnerAuth, userAuth };
