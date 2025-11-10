require("module-alias/register");

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectTODB = require("@configs/DB/db.config");
const checkDBConnection = require("@middlewares/DB/db.middleware");

connectTODB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(checkDBConnection);

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok", message: "App running fine." });
});

app.use((error, req, res, next) => {
  console.error("[App.js] Error stack:", error.stack);
  return res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error.",
  });
});

module.exports = app;
