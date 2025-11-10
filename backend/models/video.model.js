const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    accountType: {
      type: String,
      required: true,
      enum: ["private", "public"],
      default: "private",
    },

    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    videoTitle: {
      type: String,
      required: true,
      trim: true,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    likedBy: [
      {
        type: String,
        uname: String,
      },
    ],

    commentsCount: {
      type: Number,
      default: 0,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

videoSchema.index({ createdAt: -1, uid: 1 });

const videoModel = mongoose.model("Video", videoSchema);

module.exports = videoModel;
