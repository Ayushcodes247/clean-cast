const { createImageForUpload } = require("@services/image.service");
const imageKit = require("@configs/imageKit.config");
const imageModel = require("@models/image.model");
const axios = require("axios");

module.exports.uploadImage = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = req.user;
    const accountType = user.accountType;
    const token =
      req.cookies?.token ||
      req.cookies?.fb_auth_token ||
      req.headers?.authorization?.split(" ")[1];

    const { description } = req.body;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization token is missing." });
    }

    if (!uid) {
      return res.status(401).json({
        success: false,
        message: "User Id is not provided in params.",
      });
    }

    if (!user || !user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }

    const file = req.file || req.file?.buffer;

    if (!file) {
      return res.status(400).json({
        success: true,
        message: "Image for upload not provided or found.",
      });
    }

    const image = await imageKit.upload({
      file: req.file?.buffer,
      fileName: `${req.file.originalname}_${Date.now()}.jpg`,
    });

    const uploadImage = await createImageForUpload({
      uid,
      uName : req.user?.username,
      uAccountType: accountType,
      imageUrl: image.url,
      fileId: image.fileId,
      description: description || "",
    });

    const headers = `Bearer ${token}`;

    await axios.post(
      `http://localhost:${process.env.PORT}/api/users/post/image`,
      {
        _id: uid,
        fileId: uploadImage.fileId,
        imageUrl: uploadImage.imageUrl,
        imageId: uploadImage._id,
      },
      {
        headers: {
          Authorization: headers,
        },
      }
    );

    res.status(201).json({
      success: true,
      uploadImage,
      message: "Image uploaded successfully.",
    });
  } catch (error) {
    console.error("Error while uploading image:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error." });
  }
};
