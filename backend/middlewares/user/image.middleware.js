const { moderateImage, isNSFW } = require("@utils/image.util");
const fs = require("fs");

async function authenticateImage(req, res, next) {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "No image file provided for moderation.",
      });
    }

    const filePath = req.file?.path;
    const fileBuffer = fs.readFileSync(filePath);

    const indications = await moderateImage(fileBuffer);
    const threshold = Number(process.env.NSFW_THRESHOLD) || 0.7;
    const classGot = indications.filter((cls) => {
      if (cls.probability >= threshold) {
        fs.unlinkSync(filePath);
        return { className: cls.className, probability: cls.probability };
      }
    });

    if (isNSFW(indications, threshold)) {
      console.warn(
        `NSFW content detected. Upload rejected for user: ${user.username}`
      );
      return res.status(400).json({
        success: false,
        message: "Explicit content detected. Upload rejected.",
        indications: {
          classGot,
        },
      });
    }

    next();
  } catch (error) {
    console.error("[NSFW Middleware Error]:", error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "Internal server error during image moderation.",
    });
  }
}

module.exports = { authenticateImage };
