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

    res.cookie("fb_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Facebook login successful",
      user,
      token,
    });
  }
);

module.exports = router;
