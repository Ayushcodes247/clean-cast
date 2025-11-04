const express = require("express");
const router = express.Router();
const {
  register,
  login,
  profile,
  logout,
  supUpload,
  supDelete,
} = require("@controllers/user.controller");
const { body } = require("express-validator");
const { authenticateUser } = require("@middlewares/user.middleware");
const limiter = require("@utils/rateLimiter.util");

/**
 * Validation Rules
 */
const registerValidation = [
  body("username")
    .trim()
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username should be between 3 to 50 characters."),
  body("email").isEmail().withMessage("Please provide a valid email address."),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long."),
  body("age")
    .optional()
    .isInt({ min: 16 })
    .withMessage("Age must be 16 or older."),
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Please enter a valid gender."),
  body("accountType")
    .optional()
    .isIn(["public", "private"])
    .withMessage("Account type must be either public or private."),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email address."),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long."),
];

const uploadValidation = [
  body("fileId").isString().withMessage("Please provide a fileId"),
  body("imageUrl").isString().withMessage("Please provide imageUrl"),
  body("imageId").isString().withMessage("Please provide imageId"),
];

const deletionValidation = [
  body("fileId").isString().withMessage("Please provide a fileId"),
];

/**
 * Auth Routes
 */
router.post("/register", limiter, registerValidation, register);
router.post("/login", limiter, loginValidation, login);

/**
 * Protected Routes
 */
router.get("/profile", authenticateUser, profile);
router.post("/logout", authenticateUser, logout);

/**
 * Suppoter Routes For Image Functionality
 */

router.post("/post/image", authenticateUser, uploadValidation, supUpload);

router.post(
  "/post/image/delete",
  authenticateUser,
  deletionValidation,
  supDelete
);

module.exports = router;
