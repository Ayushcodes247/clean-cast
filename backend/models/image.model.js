const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },

    uAccountType: {
      type: String,
      ref: "User",
      required: true,
    },

    uName: {
      type: String,
      ref: "User",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    fileId: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      maxlength: [200, "Description cannot be more than 200 characters"],
      default: "",
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    commentCount: {
      type: Number,
      default: 0,
    },

    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

imageSchema.index({ uid: 1, createdAt: -1 });

const imageModel = mongoose.model("Image", imageSchema);

module.exports = imageModel;
