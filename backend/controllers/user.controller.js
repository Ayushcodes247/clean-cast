const blackListTokenModel = require("@models/blackListToken.model");
const userModel = require("@models/user.model");
const { createUser, findByEmail } = require("@services/user.service");
const { validationResult } = require("express-validator");

// ---------------- REGISTER ----------------
module.exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: errors.array(),
      });
    }

    const { username, email, password, age, gender, accountType } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const user = await createUser({
      username,
      email,
      password,
      accountType,
      age,
      gender,
    });

    const token = user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, ...userData } = user.toObject();

    return res.status(201).json({
      success: true,
      message: "User registration successful.",
      data: { user: userData, token },
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ---------------- LOGIN ----------------
module.exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await findByEmail({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userData } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { user: userData, token },
    });
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ---------------- PROFILE ----------------
module.exports.profile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const user = await userModel
      .findById(req.user._id)
      .select("-password -__v");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully.",
      data: { user },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ---------------- LOGOUT ----------------
module.exports.logout = async (req, res) => {
  try {
    const token =
      req.cookies?.token ||
      req.cookies?.fb_auth_token ||
      req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token provided.",
      });
    }

    await blackListTokenModel.create({ token });

    if (req.isAuthenticated && req.isAuthenticated()) {
      await new Promise((resolve) => req.logout(() => resolve()));
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.clearCookie("fb_auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    console.error("Error during user logout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
