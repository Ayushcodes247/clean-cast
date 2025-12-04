const express = require("express");
const router = express.Router();
const {
  register,
  login,
  profile,
  logout,
  deleteUser,
  email,
  username,
  accountType,
  password,
} = require("@controllers/user/user.controller");
const { body } = require("express-validator");
const { authenticateUser } = require("@middlewares/user/user.middleware");

const registerBodyValidation = [
  body("username")
    .trim()
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username should be between 3 to 50 characters."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address."),
  body("password")
    .trim()
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long."),
  body("age")
    .toInt()
    .isInt({ min: 16 })
    .withMessage("Age cannot be less than 16."),
  body("gender")
    .trim()
    .isString()
    .isIn(["male", "female", "other"])
    .withMessage("Please enter a valid gender."),
  body("accountType")
    .trim()
    .isString()
    .isIn(["public", "private"])
    .withMessage("Account type must be either public or private."),
];

const loginBodyValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address."),
  body("password")
    .trim()
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long."),
];

const validateUpdateEmail = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address."),
];

const validateUpdateUsername = [
  body("username")
    .trim()
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username should be between 3 to 50 characters."),
];

const validateUpdateAccountType = [
  body("accountType")
    .trim()
    .isString()
    .isIn(["public", "private"])
    .withMessage("Account type must be either public or private."),
];

const validateUpdatePassword = [
  body("password")
    .trim()
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long."),
];

router.post("/register", registerBodyValidation, register);
router.post("/login", loginBodyValidation, login);
router.get("/profile", authenticateUser, profile);
router.get("/logout", authenticateUser, logout);
router.delete("/delete", authenticateUser, deleteUser);

router.patch("/email", validateUpdateEmail, authenticateUser, email);
router.patch("/username", validateUpdateUsername, authenticateUser, username);
router.patch(
  "/accountType",
  validateUpdateAccountType,
  authenticateUser,
  accountType
);
router.patch("/password", validateUpdatePassword, authenticateUser, password);

module.exports = router;
