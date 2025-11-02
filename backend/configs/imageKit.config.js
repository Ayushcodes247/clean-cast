const imageKit = require("imagekit");

const imageKitConfig = new imageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL,
});

module.exports = imageKitConfig;
