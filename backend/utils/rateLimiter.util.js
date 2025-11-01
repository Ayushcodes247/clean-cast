const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 attempts per 10 min
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

module.exports = limiter;
