const mongoose = require("mongoose");
const Joi = require("joi");

const deletionSchema = new mongoose.Schema(
  {
    userData: [
      {
        uid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
          index: true,
          unique: true,
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
          lowercase: true,
          trim: true,
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
          min: [16, "Age cannot be less than 16"],
          required: true,
        },

        gender: {
          type: String,
          enum: ["male", "female", "other"],
          default: "other",
          required: true,
        },

        deletedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

deletionSchema.index({});

deletionSchema.index(
  { deletedAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

function validateDeletionData(data) {
  try {
    const schema = Joi.object({
      userData: Joi.array().required(),
    }).unknown(false);

    const validationResult = schema.validate(data, { abortEarly: false });

    return validationResult;
  } catch (error) {
    console.error("Error while validating deletion data:", error.message);
    return error;
  }
}

const deletionModel = mongoose.model("Deletion", deletionSchema);

module.exports = { deletionModel, validateDeletionData };
