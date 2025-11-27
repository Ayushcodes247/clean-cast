require("module-alias/register");

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const path = require("path");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("@configs/facebook.config");
const sessionStorage = require("@configs/DB/session.config");
const router = require("./routes/index.route");
const helmet = require("helmet");

const connectTODB = require("@configs/DB/db.config");
const checkDBConnection = require("@middlewares/DB/db.middleware");
const { rateLimit } = require("express-rate-limit");

const masterRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests, please try again later." },
});

connectTODB();

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET || "default_secret",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    },
    store: sessionStorage,
  })
);
app.use(helmet());
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(passport.initialize());
app.use(passport.session());

app.use(checkDBConnection);

app.use("/api/", masterRateLimiter, checkDBConnection, router);

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
