require("module-alias/register");

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const facebookRoutes = require("@routes/facebook.route");
const session = require("express-session");
const passport = require("@configs/facebook.config");
const sessionStorage = require("@configs/DB/session.config");

const connectTODB = require("@configs/DB/db.config");
const checkDBConnection = require("@middlewares/DB/db.middleware");

connectTODB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET || "default_secret",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
    store: sessionStorage,
  })
);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(passport.initialize());
app.use(passport.session());

app.use(checkDBConnection);

app.use("/auth", checkDBConnection, facebookRoutes);

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
