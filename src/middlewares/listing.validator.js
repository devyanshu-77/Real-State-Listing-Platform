import fs from "node:fs";

import { body, validationResult } from "express-validator";
import AppError from "../utils/appError.js";
import ApiResponse from "../utils/ApiResponse.js";

function validateData(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const formatedErrors = {};
  errors.array().forEach((err) => {
    if (!formatedErrors[err.path]) {
      formatedErrors[err.path] = err.msg;
    }
  });
  ApiResponse.error(res, "Validation error", formatedErrors, 400);
}

const propertyTypes = [
  "flat",
  "apartment",
  "house",
  "villa",
  "penthouse",
  "duplex",
  "triplex",
];
const propertyStatus = ["active", "inactive", "sold", "rented"];
const createListingValidation = [
  body("title")
    .exists()
    .withMessage("Title must be provided")
    .isLength({
      min: 10,
      max: 100,
    })
    .withMessage("Title length must be between 10 to 100 characters"),
  body("status")
    .exists()
    .withMessage("Property status is required")
    .isIn(propertyStatus)
    .withMessage("Property staus can be - active, inactive, sold, rented"),
  body("description")
    .exists()
    .withMessage("Description is required")
    .isLength({
      min: 100,
      max: 5000,
    })
    .withMessage("Description length must be between 100 to 5000 characters"),
  body("propertyType")
    .exists()
    .withMessage("Property type is required")
    .isString()
    .withMessage("Property type must be a strin")
    .custom((value, { req }) => {
      if (!propertyTypes.includes(value.toLowerCase())) {
        fs.rmSync(`uploads/user-${req.user.id}`);
        return false;
      }
      return true;
    })
    .withMessage(
      "Property type can be flat apartment house villa penthouse duplex triplex",
    ),
  body("price")
    .exists()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  body("location.city").exists().withMessage("City name is required"),
  body("location.address").exists().withMessage("City address is required"),
  body("propertyType").exists(),
  body("bedrooms")
    .exists()
    .withMessage("Bedrooms numbers are required")
    .isNumeric()
    .withMessage("No. of bedrooms must be a NUMBERk"),
  body("bathrooms")
    .exists()
    .withMessage("Bedrooms numbers are required")
    .isNumeric()
    .withMessage("No. of bedrooms must be a NUMBERk"),
  body("area")
    .exists()
    .withMessage("Area is required!")
    .isNumeric()
    .withMessage("Area must be a number"),
  body("amenities")
    .optional()
    .isArray()
    .withMessage("amenities must be an array"),
  validateData,
];
const updateListingValidation = [
  body("title")
    .optional({ nullable: false })
    .isLength({
      min: 10,
      max: 100,
    })
    .withMessage("Title length must be between 10 to 100 characters"),
  body("description")
    .optional()
    .isLength({
      min: 100,
      max: 5000,
    })
    .withMessage("Description length must be between 100 to 5000 characters"),
  body("status")
    .exists()
    .withMessage("Property status is required")
    .isIn(propertyStatus)
    .withMessage("Property staus can be - active, inactive, sold, rented"),
  body("price").optional().isNumeric().withMessage("Price must be a number"),
  body("location.city").optional(),
  body("location.address").optional(),
  body("propertyType").optional(),
  body("propertyType")
    .exists()
    .withMessage("Property type is required")
    .isIn(propertyTypes),
  body("bedrooms")
    .optional()
    .isNumeric()
    .withMessage("No. of bedrooms must be a NUMBERk"),
  body("bathrooms")
    .optional()
    .isNumeric()
    .withMessage("No. of bedrooms must be a NUMBERk"),
  body("area").optional().isNumeric().withMessage("Area must be a number"),
  body("amenities")
    .optional()
    .isArray()
    .withMessage("amenities must be an array"),
  validateData,
];
const searchListingValidation = [
  body("minPrice")
    .optional()
    .isNumeric()
    .withMessage("Min price must be a number"),
  body("maxPrice")
    .optional()
    .isNumeric()
    .withMessage("Min price must be a number"),
  body("location")
    .optional()
    .custom((value) => {
      if (typeof value !== "string" || "" === value.trim()) {
        return false;
      }
      return true;
    })
    .withMessage("location must be a string"),
  body("propertyType")
    .exists()
    .withMessage("Property type is required")
    .isString()
    .withMessage("Property type must be a strin")
    .custom((value, { req }) => {
      if (!propertyTypes.includes(value.toLowerCase())) {
        fs.rmSync(`uploads/user-${req.user.id}`);
        return false;
      }
      return true;
    })
    .withMessage(
      "Property type can be flat apartment house villa penthouse duplex triplex",
    ),
  body("propertyType")
    .optional()
    .isIn(propertyTypes)
    .withMessage(
      "Property type can be flat apartment house villa penthouse duplex triplex",
    ),
  validateData,
];

export {
  createListingValidation,
  updateListingValidation,
  searchListingValidation,
};
