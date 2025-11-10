const express = require("express");
const router = express.Router();
const {
  feedImage,
  addViews,
  addLike,
} = require("@controllers/feed.controller");
const { authenticateUser } = require("@middlewares/user.middleware");

router.get("/images/get", authenticateUser, feedImage);

router.post("/images/:imgId/views", authenticateUser, addViews);

router.post("/images/:imgId/like", authenticateUser, addLike);

module.exports = router;
