const express = require("express");
const router = express.Router();
const upload = require("@configs/multer.config");
const { authenticateImage } = require("@middlewares/user/image.middleware");
const { authenticateUser } = require("@middlewares/user/user.middleware");
const { uploadImage, fetchImage, deleteImage } = require("@controllers/user/image.controller");

router.post("/upload", authenticateUser , upload.single("image") , authenticateImage , uploadImage);

router.get("/fetchImages", authenticateUser , fetchImage);

router.delete("/delete/:fileId", authenticateUser , deleteImage);

module.exports = router;