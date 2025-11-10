const express = require("express");
const router = express.Router();
const { authenticateUser } = require("@middlewares/user.middleware");
const upload = require("@configs/multer.config");
const { authenticateImage } = require("@middlewares/image.middleware");
const { uploadImage, deleteImage, allImages } = require("@controllers/image.controller");

router.post(
  "/upload/:uid",
  authenticateUser,
  upload.single("image"),
  authenticateImage,
  uploadImage
);

router.get("/all", authenticateUser, allImages);

router.delete("/delete/:fileId", authenticateUser, deleteImage);

module.exports = router;
