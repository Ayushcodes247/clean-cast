const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { register, login, profile, logout } = require("@controllers/user/user.controller");
const { authenticateUser } = require("@middlewares/user/user.middleware");

const registerBodyValidation = [
  body("username")
    .escape()
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username should be between 3 to 50 characters."),
  body("email")
    .escape()
    .isEmail()
    .withMessage("Please provide a valid email address."),
  body("password")
    .escape()
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long."),
  body("age")
    .escape()
    .isInt({ min: 16 })
    .withMessage("Age cannot be less than 16."),
  body("gender")
    .escape()
    .isString()
    .isIn(["male", "female", "other"])
    .withMessage("Please enter a valid gender."),
  body("accountType")
    .escape()
    .isString()
    .isIn(["public", "private"])
    .withMessage("Account type must be either public or private."),
];

const loginBodyValidation = [
  body("email")
    .escape()
    .isEmail()
    .withMessage("Please provide a valid email address."),
  body("password")
    .escape()
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long."),
];

router.post("/register", registerBodyValidation, register);

router.post("/login" , loginBodyValidation , login);

router.get("/profile", authenticateUser , profile);

router.post("/logout", authenticateUser , logout);

module.exports = router;
