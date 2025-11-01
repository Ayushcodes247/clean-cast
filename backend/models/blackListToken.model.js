const mongoose = require("mongoose");

/**
 * Blacklist Token Schema
 * ----------------------
 * Stores JWT tokens that are no longer valid (e.g., after logout or revocation).
 * Tokens automatically expire after 24 hours using a TTL index.
 */
const blackListTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Prevent duplicate tokens,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800, //  7 days TTL
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    collection: "blacklist_tokens", // Explicit collection name
  }
);

/**
 * Model: BlacklistToken
 * ---------------------
 * Interacts with the "blacklist_tokens" collection.
 * Typical use cases:
 *  - Add token when user logs out
 *  - Verify token during authentication
 */
const blackListTokenModel = mongoose.model(
  "BlacklistToken",
  blackListTokenSchema
);

module.exports = blackListTokenModel;
