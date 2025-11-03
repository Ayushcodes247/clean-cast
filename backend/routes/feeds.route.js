const express = require("express");
const router = express.Router();
const { feedImage } = require("@controllers/feed.controller");
const { authenticateUser } = require("@middlewares/user.middleware");

router.get("/get", authenticateUser, feedImage);

module.exports = router;
