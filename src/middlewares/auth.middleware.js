import jwt from "jsonwebtoken";

import AppError from "../utils/appError.js";

const JWT_SECRET = process.env.JWT_SECRET;

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
  req.user = {
    id: decoded.id,
    role: decoded.role,
  };
  next();
}

export { userAuth };
