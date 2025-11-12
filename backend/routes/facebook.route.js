const express = require("express");
const router = express.Router();
const passport = require("@configs/facebook.config");

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureMessage: "Failed to register/login.",
  }),
  (req, res) => {
    const { user, token } = req.user;
    res.status(200).json({
      success: true,
      message: "Facebook login successful",
      user,
      token,
    });
  }
);

module.exports = router;
