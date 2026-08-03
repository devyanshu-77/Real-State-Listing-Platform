import { body, validationResult } from "express-validator";
import ApiResponse from "../utils/ApiResponse.js";

function validateData(req, res, next) {
  const results = validationResult(req);
  if (results.isEmpty()) {
    return next();
  }
  const formattedErrors = {};
  results.errors.forEach((err) => {
    if (!formattedErrors[err.path]) {
      formattedErrors[err.path] = err.msg;
    }
  });
  ApiResponse.error(res, "Validation error", formattedErrors, 400);
}
const registerAdminValidation = [
  body("username")
    .exists()
    .withMessage("Username must be provided")
    .isLength({ min: 3, max: 32 })
    .withMessage("Username must be between 3 and 32 characters long."),
  body("email")
    .exists()
    .withMessage("Please send a valid email")
    .isEmail()
    .withMessage("Provide a valid email")
    .isLength({ min: 6, max: 254 })
    .withMessage("Email must be between 6 and 254 characters long."),
  body("password")
    .exists()
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters long.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/,
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
  body("role")
    .exists()
    .equals("admin")
    .withMessage("only admins have access to this resource"),
  validateData,
];

export { registerAdminValidation };
