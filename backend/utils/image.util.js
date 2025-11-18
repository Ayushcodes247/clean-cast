const tf = require("@tensorflow/tfjs");
const nsfw = require("nsfwjs");
const sharp = require("sharp");
const { createCanvas, loadImage } = require("canvas");
const crypto = require("crypto");

let model = null;
const cache = new Map();

async function loadModel() {
  if (!model) {
    console.log("[NSFW] Loading model...");
    model = await nsfw.load();
    console.log("[NSFW] Model loaded successfully!");
  }
  return model;
}

function generateHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function moderateImage(imageBuffer) {
  try {
    const model = await loadModel();

    const hash = generateHash(imageBuffer);
    if (cache.has(hash)) return cache.get(hash);

    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(512, 512)
      .jpeg()
      .toBuffer();

    const img = await loadImage(resizedImageBuffer);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const tensor = tf.browser.fromPixels(canvas);

    const indications = await model.classify(tensor);

    tensor.dispose();

    cache.set(hash, indications);

    return indications;
  } catch (error) {
    console.error("[NSFW] Error during moderation:", error.message);
    throw new Error("Image moderation failed");
  }
}

function isNSFW(
  indications,
  threshold = Number(process.env.NSFW_THRESHOLD) || 0.7
) {
  const nsfwFlags = ["Hentai", "Porn", "Sexy"];
  return indications.some(
    (cls) =>
      nsfwFlags.includes(cls.className) &&
      cls.probability >= parseFloat(threshold)
  );
}

module.exports = { moderateImage, isNSFW, loadModel };
