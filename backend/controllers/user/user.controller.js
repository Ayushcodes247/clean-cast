const { userModel, validateUser } = require("@models/user.model");
const { validationResult } = require("express-validator");
const generatePid = require("@utils/pidGenerator.util");

module.exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { username, email, password, age, gender, accountType } = req.body;

    const userObject = {
      username,
      email,
      password,
      age,
      gender,
      accountType,
      pid: generatePid(),
      profilePic: `${process.env.BASE_URL}/public/images/avatar.jpg`,
    };

    const { error } = validateUser(userObject);

    if (error) {
      console.error("Joi Validation Error:", error.details);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const hashPass = await userModel.hashPassword(password);

    const user = await userModel.create({
      ...userObject,
      password: hashPass,
    });

    const token = user.generateAuthToken();

    res.cookie("register_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registration completed successfully.",
      user,
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "User registration failed.",
      error: error.message,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = user.generateAuthToken();

    res.cookie("login_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: safeUser,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "User login failed.",
      error: error.message,
    });
  }
};

