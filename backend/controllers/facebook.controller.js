module.exports.fbAuth = (req, res) => {
  try {
    const { user, token } = req.user || {};

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }

    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: "Authentication token not found." });
    }

    res.cookie("fb_auth_token", token, {
      httpOnly: true, // prevents XSS
      secure: process.env.NODE_ENV === "production", // use HTTPS in production
      sameSite: "lax", // safe for OAuth & cross-site redirects
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "User registered or logged in successfully.",
      user,
      token, // you can remove this if you don't want to send the token in response
    });
  } catch (error) {
    console.error("Error while setting token in cookie:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while setting cookie.",
    });
  }
};
