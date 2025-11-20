const express = require("express");
const router = express.Router();
const { authenticateUser } = require("@middlewares/user/user.middleware");
const { images } = require("@controllers/user/feed.controller");

router.get("/images", authenticateUser , images);

module.exports = router;