const tf = require("@tensorflow/tfjs");
const nsfw = require("nsfwjs");
const { createCanvas, loadImage } = require("canvas");
const crypto = require("crypto");
const sharp = require("sharp");

let model = null;
const cache = new Map();

const isModelLoaded = async () => {
  if (!model) {
    console.log("[NSFW] Loading model...");
    model = await nsfw.load();
    console.log("[NSFW] model loaded successfully!");
  }

  return model;
};

const generateHash = (buffer) =>
  crypto.createHash("sha256").update(buffer).digest("hex");

const moderateImage = async (imageBuffer) => {
  try {
    const model = await isModelLoaded();

    const hash = generateHash(imageBuffer);
    if (cache.has(hash)) return cache.get(hash);

    const resizedIamgeBuffer = await sharp(imageBuffer)
      .resize(512, 512)
      .jpeg()
      .toBuffer();

    const img = await loadImage(resizedIamgeBuffer);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const tensor = tf.browser.fromPixels(canvas);

    const classifications = await model.classify(tensor);

    tensor.dispose();

    cache.set(hash, classifications);

    return classifications;
  } catch (error) {
    console.error("[NSFW] Error during moderation:", error.message);
    throw new Error("Image moderation failed.");
  }
};

const isNSFW = (
  classifications,
  threshold = Number(process.env.NSFW_THRESHOLD) || 0.7
) => {
  try {
    const nsfwFlags = ["Hentai", "Porn", "Sexy"];
    return classifications.some(
      (cls) =>
        nsfwFlags.includes(cls.className) &&
        cls.probability >= parseFloat(threshold)
    );
  } catch (error) {
    console.error("Error while Detecting [NSFW] content:", error.message);
    throw new Error("Image Content Detection Failed.");
  }
};

module.exports = {
    moderateImage,
    isNSFW,
    isModelLoaded
};