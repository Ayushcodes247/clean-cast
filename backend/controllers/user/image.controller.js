const { imageModel , validateImageData } = require("@models/image.model");
const imagekitConfig = require("@configs/imagekit.config");

module.exports.uploadImage = async (req, res) => {
    try{

        const user = req.user;
        

    }catch(error){
        console.error("Error while uploading image:", error);
        return res.status(500).json({ success : false , message : error.message || "Internal server errpr." });
    }
};