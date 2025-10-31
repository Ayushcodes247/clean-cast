const express = require("express");
const router = express.Router();
const passport = require("passport");
const { fbAuth } = require('@controllers/facebook.controller');

// Start login process
router.get(
  "/",
  passport.authenticate("facebook", { scope: ["email"] })
);

// Callback after authentication
router.get(
  "/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  fbAuth  
);

module.exports = router;
