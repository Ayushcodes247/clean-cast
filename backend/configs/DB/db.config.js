const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI);
    console.log("Connected to DATABASE SUCCESSFULLY.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected!");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });
};

module.exports = connectDB;
