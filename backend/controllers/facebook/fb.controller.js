const { validationResult } = require("express-validator");
const { userModel, validateUser } = require("@models/user.model");
const pidGenerator = require("@utils/pidGenerator.util");
const generatePass = require("@utils/fbpassgenerator.util");
const sendEmail = require("@configs/nodemailer.config");
const TOKEN_NAME = "auth_token";

module.exports.fbLogic = (req, res) => {
  if (!req.user) {
    return res.status(400).send("Facebook login failed!");
  }

  const { user, token } = req.user;
  const expiresIn = Date.now() + 10 * 24 * 60 * 60 * 1000;

  const encodedUser = encodeURIComponent(JSON.stringify(user));

  console.log("Facebook login successful:", user);

  return res.redirect(
    `http://localhost:4000/public/facebook-callback.html?user=${encodedUser}&token=${token}&expiresIn=${expiresIn}`
  );
};

module.exports.fbRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { username, email } = req.body;
    const existingUser = await userModel.findOne({ email: email });

    const genPass = generatePass(12);
    const hashPass = await userModel.hashPassword(genPass);
    const pid = pidGenerator();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const userData = {
      username: username,
      email: email,
      password: hashPass,
      age: 17,
      gender: "other",
      accountType: "private",
      pid: pid,
      profilePic: "http://localhost:4000/public/images/avatar.jpg",
    };

    const subject =
      "LOGIN PASSWORD FOR THE USER WHO IS REGISTERED VIA. FACEBOOK REGISTER/LOGIN";
    const text = `
          Hi ${userData.username || "User"},

          You have successfully registered via. facebook and here is your password for manual login.
          ${userData.username}'s Password : ${genPass}.

          Regards,
          CleanCast support 
          `;

    await sendEmail(userData.email, subject, text);

    const { value, error } = await validateUser(userData);
    if (error) {
      console.error("Error while validating user:", error.message);
      return res
        .status(400)
        .json({ success: false, message: error.message, error: error });
    }

    const user = await userModel.create(value);
    const token = user.generateAuthToken();

    const expiresIn = 7 * 24 * 60 * 60;

    res.cookie(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Registeration successful through facebook.",
      user: user,
      token: token,
      expiresIn,
    });
  } catch (error) {
    console.error("Error while registering through Facebook:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
      error: error,
    });
  }
};

module.exports.fbLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: errors.array(),
      });
    }

    const { email } = req.body;

    const user = await userModel
      .findOne({ email: email })
      .select("-password -__v");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or user not exist's.",
      });
    }

    const token = user.generateAuthToken();

    res.cookie(TOKEN_NAME, token, {
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

    const expiresIn = 7 * 24 * 60 * 60;

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: safeUser,
      token: token,
      expiresIn,
    });
  } catch (error) {
    console.error("Error while login through facebook:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
      error: error,
    });
  }
};
