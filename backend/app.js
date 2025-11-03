require("module-alias/register");

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const connectDB = require("@configs/DB/db.config");
const sessionStore = require("@configs/DB/sessionStorage.config");
const passport = require("@configs/passport.config");
const facebookRoute = require("@routes/facebook.route");
const userRouter = require("@routes/user.route");
const imageRouter = require("@routes/image.route");
const feedsImageRouter = require("@routes/feeds.route");

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("combined"));
app.use(cors());
app.use(cookieParser());

app.use(helmet());
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth/facebook", facebookRoute);

app.use("/api/users/", userRouter);

app.use("/api/images/", imageRouter);

app.use("/api/feeds/image", feedsImageRouter);

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

const rateLimit = require("express-rate-limit");
// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true, // Include rate limit info in headers
  legacyHeaders: false, // Disable deprecated X-RateLimit-* headers
  handler: (req, res, next, options) => {
    console.warn(`Rate limit exceeded by IP: ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  },
});

app.use("/api/", apiLimiter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Interanl server error",
  });
});

module.exports = app;
