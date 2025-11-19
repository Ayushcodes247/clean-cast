const { imageModel, validateImageData } = require("@models/image.model");
const imagekit = require("@configs/imagekit.config");
const fs = require("fs");

module.exports.uploadImage = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    const file = req.file;
    if (!file || !file.path) {
      return res.status(400).json({
        success: false,
        message: "File and file path not provided.",
      });
    }

    const fileBuffer = fs.readFileSync(file.path);

    const image = await imagekit.upload({
      file: fileBuffer,
      fileName: file.originalname,
    });

    const imageUrl = image.url;
    const fileId = image.fileId;

    fs.unlinkSync(file.path);

    const { description } = req.body;

    const { value, error } = await validateImageData({
      uid: user._id,
      accountType: user.accountType,
      username: user.username,
      imageUrl,
      fileId,
      description,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    const postedImage = await imageModel.create({
      uid: value.uid,
      accountType: value.accountType,
      username: value.username,
      imageUrl: value.imageUrl,
      fileId: value.fileId,
      description: value.description,
    });

    return res.status(201).json({
      success: true,
      postedImage,
      message: "Image posted successfully.",
    });
  } catch (error) {
    console.error("Error while uploading image:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};
