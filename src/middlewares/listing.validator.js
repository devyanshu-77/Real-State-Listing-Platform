import { body, validationResult } from "express-validator";

function validateCreateListing(req, res, next) {
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
  res.status(405).json({
    success: false,
    message: "Validation error",
    errors: formatedErrors,
  });
}

const createListingValidation = [
  body("title")
    .exists()
    .withMessage("Title must be provided")
    .isLength({
      min: 10,
      max: 100,
    })
    .withMessage("Title length must be between 10 to 100 characters"),
  body("description")
    .exists()
    .withMessage("Description is required")
    .isLength({
      min: 100,
      max: 5000,
    })
    .withMessage("Description length must be between 100 to 5000 characters"),
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
  body("photos").exists(),
  validateCreateListing,
];

export { createListingValidation };
