const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * User Schema — with Signal Protocol E2EE support
 * -------------------------------------------------
 * - Public keys are safe to store on server for encrypted messaging
 * - Private keys are never stored on the server
 */
const userSchema = new mongoose.Schema(
  {
    profileId: {
      type: String,
      trim: true,
      unique: true,
      index: true,
    },
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
      select: false, // Hidden by default
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

    imageCollection: [
      {
        imageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Image",
          required: true,
        },
        imageUrl: {
          type: String,
          required: true,
        },
        fileId: {
          type: String,
          required: true,
        },
      },
    ],

    videoCollection : [
      {
        videoId : {
          type : mongoose.Schema.Types.ObjectId,
          ref : "Video",
          required : true
        },
        videoUrl: {
          type : String,
          required : true
        },
        
      }
    ],

    socketId: {
      type: String,
      default: null,
      select: false,
    },
  },
  { timestamps: true }
);

// ---------------------------
// Index for optimized queries
// ---------------------------
userSchema.index({ username: 1, email: 1, accountType: 1, profileId: 1 });

// ---------------------------
// JWT Generation
// ---------------------------
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ---------------------------
// Password Hashing
// ---------------------------
userSchema.statics.hashPassword = async function (plainPassword) {
  return bcrypt.hash(plainPassword, 12);
};

// ---------------------------
// Compare Password
// ---------------------------
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
