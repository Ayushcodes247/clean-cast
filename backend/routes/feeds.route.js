const express = require("express");
const router = express.Router();
const { feedImage, addViews } = require("@controllers/feed.controller");
const { authenticateUser } = require("@middlewares/user.middleware");

router.get("/images/get", authenticateUser, feedImage);

router.post("/images/:imgId/views", authenticateUser, addViews);

module.exports = router;
