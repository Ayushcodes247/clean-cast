const ImageKit = require('imagekit');

// -------------------------------
// ImageKit Configuration
// -------------------------------
// Used to upload images directly from buffer or file
// Stores images in your ImageKit account and returns a URL
// -------------------------------
const imageKitConfig = new ImageKit({
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY, // ---------------- Important: Keep private key secure ----------------
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT || process.env.IMAGE_KIT_PRIVATE_URL, 
    // ---------------- Added fallback for URL endpoint env var ----------------
});

module.exports = imageKitConfig;
