const mongoose = require("mongoose");
const Joi = require("joi");

const imageSchema = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  accountType: {
    type: String,
    enum: ["public", "private"],
    default: "private",
    required: true,
    index: true,
  },

  username: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Username should have at least 3 characters"],
    maxlength: [50, "Username cannot exceed 50 characters"],
  },

  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },

  fileId: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    maxlength: [200, "Description cannot be more than 200 characters"],
    default: "",
  },

  likeCount: {
    type: Number,
    default: 0,
  },

  commentsCount: {
    type: Number,
    default: 0, 
  },

  likedBy : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  }],

    viewsCount: {
      type: Number,
      default: 0,
    },
}, {
  timestamps : true
});

imageSchema.index({ createdAt : -1 });

const imageModel = mongoose.model("Image", imageSchema);