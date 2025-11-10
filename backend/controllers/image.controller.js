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
      uName: req.user?.username,
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

module.exports.deleteImage = async (req, res) => {
  try {
    const user = req.user;
    const token =
      req.cookies?.token ||
      req.cookies?.fb_auth_token ||
      req.headers?.authorization?.split(" ")[1];

    if (!user || !user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }

    const { fileId } = req.params;
    if (!fileId) {
      return res
        .status(400)
        .json({ success: false, message: "File ID parameter is required." });
    }

    const image = await imageModel.findOne({ uid: user._id, fileId });
    if (!image) {
      return res.status(404).json({
        success: false,
        message: `No image found for user ${user._id} with fileId ${fileId}.`,
      });
    }

    try {
      await imageKit.deleteFile(fileId);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete image from storage.",
        error: error.message,
      });
    }

    await imageModel.findOneAndDelete({ uid: user._id, fileId });

    await axios.post(
      `http://localhost:${process.env.PORT}/api/users/post/image/delete`,
      {
        fileId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully.",
    });
  } catch (error) {
    console.error("Error while deleting post:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports.allImages = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    const images = await imageModel.find({ uid: user._id }).select("-__v");

    if (!images.length) {
      return res.status(404).json({
        success: false,
        message: "No images found for this user.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Images fetched successfully.",
      images,
    });
  } catch (error) {
    console.error("Error while fetching images:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
