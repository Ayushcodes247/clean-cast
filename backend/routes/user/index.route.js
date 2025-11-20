const express = require("express");
const router = express.Router();
const auth = require("@routes/user/authentication/auth.route");
const images = require("@routes/user/images/index.route");
const feeds = require("@routes/user/feeds/index.route");
const { authenticateUser } = require("@middlewares/user/user.middleware");

router.use("/" , auth);
router.use("/images", authenticateUser  ,images);
router.use("/feeds",  authenticateUser , feeds);

module.exports = router;
