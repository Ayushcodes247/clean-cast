const express = require("express");
const router = express.Router();
const {
  register,
  login,
  profile,
  logout,
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
  body("age").optional().isInt({ min: 16 }).withMessage("Age must be 16 or older."),
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

module.exports = router;
