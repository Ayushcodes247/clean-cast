const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Username should have at least 3 characters"],
      maxlength: [50, "Username cannot exceed 50 characters"],
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
      index: true,
    },

    password: {
      type: String,
      select: false,
      minlength: [8, "Password should have at least 8 characters"],
    },

    accountType: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      required: true,
      index: true,
    },

    age: {
      type: Number,
      required: true,
      min: [16, "Age cannot be less than 16"],
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
      required: true,
    },

    socketId: {
      type: String,
      default: null,
      select: false,
    },

    profilePic: {
      type: String,
    },

    pid: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ username: 1, email: 1, accountType: 1 });

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

userSchema.statics.hashPassword = async function (plainPassword) {
  return bcrypt.hash(plainPassword, 12);
};

userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

function validateUser(data) {
  try {
    const schema = Joi.object({
      username: Joi.string().min(3).max(50).trim().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).optional(),
      accountType: Joi.string().valid("public", "private").required(),
      age: Joi.number().min(16).integer().required(),
      gender: Joi.string().valid("male", "female", "other").required(),
      profilePic: Joi.string().uri().optional(),
      pid: Joi.string().alphanum().required(),
    }).unknown(false);

    const validationResult = schema.validate(data, { abortEarly: false });

    return validationResult;
  } catch (error) {
    console.error("Error while validating user data:", error.message);
    return error;
  }
}

const userModel = mongoose.model("User", userSchema);

module.exports = { userModel, validateUser };
