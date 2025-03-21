const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

// Validation for creating a blog post
exports.createBlogValidation = [
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters long"),

  check("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long"),

  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters long"),

  check("image")
    .optional() // Image is optional as per your schema
    .isString()
    .withMessage("Image must be a valid string (file path)"),

  validatorMiddleware, // Middleware to handle validation errors
];

// Validation for updating a blog post
exports.updateBlogValidation = [
  check("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters long"),

  check("content")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long"),

  check("category")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters long"),

  check("image")
    .optional()
    .isString()
    .withMessage("Image must be a valid string (file path)"),

  validatorMiddleware,
];

// Validation for getting or deleting a blog post by ID
exports.getOrDeleteBlogValidation = [
  check("id").isMongoId().withMessage("Invalid Blog ID format"),

  validatorMiddleware,
];
