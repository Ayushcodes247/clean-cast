const jwt = require("jsonwebtoken");
const userModel = require("@models/user.model");
const blackListTokenModel = require("@models/blackListToken.model");

module.exports.authenticateUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.cookies?.fb_auth_token ||
      req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication token missing." });
    }

    // Check if token is blacklisted
    const isBlacklisted = await blackListTokenModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token is blacklisted. Please log in again.",
      });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token.",
      });
    }

    // Fetch user from database
    const user = await userModel
      .findOne({ _id: decoded._id, email: decoded.email })
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found for the provided token.",
      });
    }

    req.user = user;
    req.token = token; // optional but useful
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
