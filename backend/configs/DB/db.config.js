const mongoose = require("mongoose");

const connectTODB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI);
    console.log(`[${new Date().toISOString()}] Connected to clean cast Database.`);
  } catch (err) {
    console.error("Error connecting to claen cast Database:", err);
    process.exit(1); // Exit process if DB connection fails
  }

  // Listen for disconnection events
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected!");
  });

  // Listen for ongoing connection errors
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
};

module.exports = connectTODB;
