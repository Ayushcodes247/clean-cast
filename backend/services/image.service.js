const imageModel = require("@models/image.model");

module.exports.createImageForUpload = async ({
  imageUrl,
  uid,
  uName,
  description,
  fileId,
  uAccountType,
}) => {
  if (!uName || !uAccountType || !imageUrl || !uid || !fileId) {
    throw new Error(
      "Image URL , User ID , User Account-Type and File ID are required."
    );
  }
  try {
    const imageUpload = await imageModel.create({
      uid,
      uName,
      uAccountType,
      imageUrl,
      fileId,
      description,
    });

    return imageUpload;
  } catch (error) {
    console.error("[ImageService Error]: Failed to create image record", error);
    throw new Error("Failed to save image to database. Please try again.");
  }
};
