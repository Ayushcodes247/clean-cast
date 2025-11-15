const { userModel } = require("@models/user.model");
const { blackListTokenModel } = require("@models/blackListToken.model");
const jwt = require("jsonwebtoken");

module.exports.authenticateUser = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      req.user = req.user;
      return next();
    }

    const token =
      req.cookies?.register_token ||
      req.cookies?.login_token ||
      req.cookies?.fb_auth_token ||
      (req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication token missing." });
    }

    const blackListed = await blackListTokenModel.findOne({ token });
    if (blackListed) {
      return res.status(401).json({
        success: false,
        message: "Token is blacklisted. Please login again.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token.",
        error: error.message,
      });
    }

    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found for the provided token.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};
