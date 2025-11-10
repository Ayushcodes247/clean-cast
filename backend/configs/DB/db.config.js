const mongoose = require("mongoose");

const connectTODB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI);
    console.log("Connected to User Microservice Database.");
  } catch (err) {
    console.error("Error connecting to User Microservice Database:", err);
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
