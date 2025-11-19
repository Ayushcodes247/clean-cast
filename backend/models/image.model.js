const mongoose = require("mongoose");
const Joi = require("joi");

const imageSchema = new mongoose.Schema(
  {
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

imageSchema.index({ createdAt: -1 });

function validateImageData(data) {
  try {
    const schema = Joi.object({
      uid: Joi.alternatives().try(Joi.string(), Joi.object()).required(),
      accountType: Joi.string().valid("public", "private").required(),
      username: Joi.string().trim().min(3).max(50).required(),
      imageUrl: Joi.string().uri().required(),
      fileId: Joi.string().trim().required(),
      description: Joi.string().max(200).allow("").optional(),
    }).unknown(false);

    const validationResult = schema.validate(data, { abortEarly: false });

    return validationResult;
  } catch (error) {
    console.error("Error while validating image data:", error.message);
    return error;
  }
}

const imageModel = mongoose.model("Image", imageSchema);

module.exports = { imageModel, validateImageData };
