const { imageModel } = require("@models/image.model");
const { userModel } = require("@models/user.model");

module.exports.images = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }

    const image = await imageModel.find().sort({ createdAt: -1 }).limit(20);

    const uids = [...new Set(image.map((img) => img.uid.toString()))];

    const publicUserDocs = await userModel
      .find({ _id: { $in: uids }, accountType: "public" })
      .select("_id username accountType");

    const publicUsers = publicUserDocs.map((u) => ({
      uid: u._id.toString(),
      username: u.username,
    }));

    const feedImages = image
      .filter((img) => publicUsers.some((u) => u.uid === img.uid.toString()))
      .map((img) => {
        const imageUser = publicUsers.find((u) => u.uid === img.uid.toString());
        return {
          id: img._id,
          user: {
            uid: imageUser?.uid,
            username: imageUser?.username || "Unknown",
          },
          imageUrl: img.imageUrl,
          description: img.description || "",
          likeCount: img.likeCount || 0,
          viewsCount: img.viewsCount || 0,
          commentCount: img.commentsCount || 0,
          createdAt: img.createdAt,
        };
      });

    return res.status(200).json({
      success: true,
      message: "Feed images fetched successfully.",
      feedImages,
    });
  } catch (error) {
    console.error("Error while fetching Public Images:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};
