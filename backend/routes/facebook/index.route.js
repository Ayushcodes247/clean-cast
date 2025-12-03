const express = require("express");
const router = express.Router();
const passport = require("@configs/facebook.config");
const {
  fbLogic,
  fbRegister,
  fbLogin,
} = require("@controllers/facebook/fb.controller");
const { body } = require("express-validator");

const registerValidator = [
  body("username")
    .trim()
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username should be between 3 to 50 characters."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address."),
];

const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address."),
];

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureMessage: "Failed to register/login.",
  }),
  fbLogic
);

router.post("/fb/register", registerValidator, fbRegister);

router.post("/fb/login", loginValidator, fbLogin);

module.exports = router;
