const express = require("express");
const router = express.Router();
const { authenticateUser } = require("@middlewares/user.middleware");
const upload = require("@configs/multer.config");
const { authenticateImage } = require("@middlewares/image.middleware");
const { uploadImage } = require("@controllers/image.controller");

router.post("/upload/:uid" , authenticateUser , upload.single("image") , authenticateImage , uploadImage)

module.exports = router;
