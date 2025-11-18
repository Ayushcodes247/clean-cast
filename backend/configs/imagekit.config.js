const ImageKit = require("imagekit");

const imagekitConfig = new ImageKit({
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT || process.env.IMAGE_KIT_PRIVATE_URL, 
});

module.exports = imagekitConfig;