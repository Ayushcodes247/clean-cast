const { moderateImage, isNSFW } = require("@utils/imageModeration.util");

module.exports.authenticateImage = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || !user._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    if (!req.file || !req.file.buffer) {
      return res
        .status(400)
        .json({ message: "No image file provided for moderation." });
    }

    const classifications = await moderateImage(req.file.buffer);

    const threshold = Number(process.env.NSFW_THRESHOLD) || 0.7;
    if (isNSFW(classifications, threshold)) {
      console.warn(
        `NSFW content detected. Upload rejected for user: ${user._id}`
      );
      return res
        .status(400)
        .json({ success : false, message: "Explicit content detected. Upload rejected." });
    }

    next();
  } catch (error) {
    console.error("[NSFW Middleware Error]:", error);
    return res.status(500).json({
      success: true,
      message: "Internal server error during image moderation.",
    });
  }
};
