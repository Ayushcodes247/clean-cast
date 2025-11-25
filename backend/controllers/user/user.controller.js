const { userModel, validateUser } = require("@models/user.model");
const { validationResult } = require("express-validator");
const generatePid = require("@utils/pidGenerator.util");
const {
  blackListTokenModel,
  validateToken,
} = require("@models/blackListToken.model");
const {
  deletionModel,
  validateDeletionData,
} = require("@models/deletion.model");
const sendEmail = require("@configs/nodemailer.config");

const TOKEN_NAME = "auth_token";

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

    res.cookie(TOKEN_NAME, token, {
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
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
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
    return res.status(500).json({
      success: false,
      message: "User login failed.",
      error: error.message,
    });
  }
};

module.exports.profile = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access." });
    }

    const user = await userModel
      .findById(req.user._id)
      .select("-password -__v")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      user,
      message: "User profile fetched successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching profile.",
      error: error.message,
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const token =
      req.cookies?.[TOKEN_NAME] ||
      (req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(400).json({ message: "No token provided." });
    }

    const { value, error } = validateToken({ token });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    await blackListTokenModel.create({ token: value.token });

    res.clearCookie(TOKEN_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while logging out.",
      error: error.message,
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    const findUser = await userModel.findById(user._id);
    if (!findUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.clearCookie(TOKEN_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const { value, error } = validateDeletionData({
      userData: [
        {
          uid: findUser._id,
          username: findUser.username,
          email: findUser.email,
          password: findUser.password,
          accountType: findUser.accountType,
          age: findUser.age,
          gender: findUser.gender,
        },
      ],
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    await deletionModel.create(value);

    const subject = "Account DELETION notice";
    const text = `
    Hi ${findUser.username || "User"},
    Your account has been successfully deleted. 
    You can reactivate your account within 30 days by logging in again.
    Click here:
    http://localhost:4000/users/reacticate-account
    If you did not request this, contact support immediately.
    Regards,
    CleanCast Support
    `;

    await sendEmail(findUser.email, subject, text);

    await findUser.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Deletion done.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in deleting the account.",
      error: error.message,
    });
  }
};

module.exports.email = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }

    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email not provided." });
    }

    const findUser = await userModel.findById(user._id);
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: `${user?.username} not found.`,
      });
    }

    findUser.email = email;
    await findUser.save();

    return res.status(200).json({
      success: true,
      message: `${user?.username}'s email updated successfully.`,
    });
  } catch (error) {
    console.error("Error while updating the email:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

module.exports.username = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }

    const { username } = req.body;
    if (!username) {
      return res
        .status(400)
        .json({ success: false, message: "Username not provided." });
    }

    const findUser = await userModel.findById(user._id);
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: `${user?.username} not found.`,
      });
    }

    findUser.username = username;
    await findUser.save();

    return res.status(200).json({
      success: true,
      message: `${user?.username}'s username updated successfully.`,
    });
  } catch (error) {
    console.error("Error while updating the username:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

module.exports.accountType = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }

    const { accountType } = req.body;
    if (!accountType) {
      return res
        .status(400)
        .json({ success: false, message: "AccountType not provided." });
    }

    const findUser = await userModel.findById(user._id);
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: `${user?.username} not found.`,
      });
    }

    findUser.accountType = accountType;
    await findUser.save();

    return res.status(200).json({
      success: true,
      message: `${user?.username}'s username updated successfully.`,
    });
  } catch (error) {
    console.error("Error while updating the accountType:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

module.exports.password = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }

    const { password } = req.body;
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password not provided." });
    }

    const findUser = await userModel.findById(user._id);
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: `${user?.username} not found.`,
      });
    }

    const hashPass = await userModel.hashPassword(password);

    findUser.password = hashPass;
    await findUser.save();

    return res.status(200).json({
      success: true,
      message: `${user?.username}'s password updated successfully.`,
    });
  } catch (error) {
    console.error("Error while updating the password:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};
