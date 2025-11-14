const express = require("express");
const router = express.Router();
const passport = require("@configs/facebook.config");
const { fbLogic } = require("@controllers/facebook/fb.controller");

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureMessage: "Failed to register/login.",
  }),
  fbLogic
);

module.exports = router;
