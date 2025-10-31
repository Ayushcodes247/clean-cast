const express = require("express");
const router = express.Router();
const { register } = require("@controllers/user.controller");
const { body } = require("express-validator");

router.post(
  "/register",
  [
    body("username")
      .isString()
      .isLength({ min: 3, max: 50 })
      .withMessage("Username should be between 3 to 50 characters."),
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email address."),
    body("password")
      .isString()
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 characters long."),
    body("age").isInt({ min: 16 }).withMessage("Age cannot be less than 16."),
    body("gender")
      .isString()
      .isIn(["male", "female", "other"])
      .withMessage("Please enter a valid gender."),
    body("accountType")
      .isString()
      .isIn(["public", "private"])
      .withMessage("Account type must be either public or private."),
  ],
  register
);

module.exports = router;
