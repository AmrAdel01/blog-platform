const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
exports.signUpValidations = [
  check("userName").trim().notEmpty().withMessage("userName is required"),
  check("email").isEmail().withMessage("Please provide a valid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validatorMiddleware,
];

exports.loginValidations = [
  check("email").isEmail().withMessage("Please provide a valid email"),
  check("password").notEmpty().withMessage("Password is required"),
  validatorMiddleware,
];
