import { body, validationResult, oneOf } from "express-validator";

function validateData(req, res, next) {
  const error = validationResult(req);
  if (error.isEmpty()) {
    return next();
  }
  res.json({ errors: error.array() });
}
const allowedUsers = ["admin", "buyer", "property_owner", "tenant"];
const registerUserRules = [
  body("username")
    .exists()
    .isLength({ min: 3, max: 32 })
    .withMessage("Username must be between 3 and 32 characters long."),
  body("email")
    .exists()
    .isEmail()
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
    .isIn(allowedUsers)
    .withMessage("Role must be one of: buyer, property_owner"),
  body("bio").exists().withMessage("user must proivde bio"),
  body("phone")
    .exists()
    .trim()
    .isMobilePhone("en-IN")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be exactly 10 digits without +91 or 0."),
  validateData,
];
const loginValidation = [
  oneOf([
    body("username")
      .isLength({ min: 3, max: 32 })
      .withMessage("Username must be between 3 and 32 characters long."),
    body("email")
      .isEmail()
      .isLength({ min: 6, max: 254 })
      .withMessage("Email must be between 6 and 254 characters long."),
  ]),
  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters long.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/,
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
  validateData,
];
const updateValidation = [
  body("username")
    .optional()
    .isLength({ min: 3, max: 32 })
    .withMessage("Username must be between 3 and 32 characters long."),
  body("email")
    .optional()
    .isEmail()
    .isLength({ min: 6, max: 254 })
    .withMessage("Email must be between 6 and 254 characters long."),
  body("password")
    .optional()
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters long.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/,
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
  body("role")
    .optional()
    .isIn(allowedUsers)
    .withMessage("Role must be one of: buyer, property_owner"),
  body("bio").optional(),
  body("phone")
    .optional()
    .trim()
    .isMobilePhone("en-IN")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be exactly 10 digits without +91 or 0."),
  validateData,
];

export { registerUserRules, loginValidation, updateValidation };
