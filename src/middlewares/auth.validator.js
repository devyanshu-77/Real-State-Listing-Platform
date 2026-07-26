import { body, validationResult } from "express-validator";

function signupValidator(req, res, next) {
  const error = validationResult(req);
  if (error.isEmpty()) {
    return next();
  }
  console.log("reached here");
  console.log(error.array());
  res.json({ errors: error.array() });
}

const allowedUsers = ["admin", "buyer", "property_owner"];

const registerUserRules = [
  body("username")
    .isLength({ min: 3, max: 32 })
    .withMessage("Username must be between 3 and 32 characters long."),
  body("email")
    .isEmail()
    .isLength({ min: 6, max: 254 })
    .withMessage("Email must be between 6 and 254 characters long."),
  body("password")
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
  body("bio").exists().withMessage("user must proivde bio"),
  body("phone")
    .trim()
    .isMobilePhone("en-IN")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be exactly 10 digits without +91 or 0."),
  signupValidator,
];

export { registerUserRules };
