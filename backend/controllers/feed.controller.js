const userModel = require("@models/user.model");
const imageModel = require("@models/image.model");

module.exports.feedImage = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    // Get all public users
    const publicUsers = await userModel.find(
      { accountType: "public" },
      "_id username"
    );

    if (!publicUsers.length) {
      return res.status(200).json({
        success: true,
        message: "No public users found.",
        feedImages: [],
      });
    }

    const publicUserIds = publicUsers.map((u) => u._id.toString());

    // Fetch recent images from those public users
    const images = await imageModel
      .find({ uid: { $in: publicUserIds } })
      .sort({ createdAt: -1 })
      .limit(20);

    // Build feed image objects
    const feedImages = images.map((img) => {
      const imageUser = publicUsers.find(
        (u) => u._id.toString() === img.uid.toString()
      );

      return {
        imageId: img._id,
        user: {
          userId: imageUser?._id,
          userName: imageUser?.username || "unknown",
        },
        imageUrl: img.imageUrl,
        description: img.description || "",
        likeCount: img.likesCount || 0,
        viewsCount: img.viewsCount || 0,
        commentCount: img.commentCount || 0,
        createdAt: img.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Feed images fetched successfully.",
      feedImages,
    });
  } catch (error) {
    console.error("Error while fetching images for the Feeds:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
