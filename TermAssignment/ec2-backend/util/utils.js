const jimp = require("jimp");
const { uploadImage } = require("./s3");

const cleanBase64 = (base64) => {
    return base64.substring("data:image/jpeg;base64,".length);
};

const extractImage = async (imageBuffer, imgName) => {
    const cleanBuffer = cleanBase64(imageBuffer);
    const imageDataBuffer = Buffer.from(cleanBuffer, 'base64');
    const publicUrl = await uploadImage(imgName, imageDataBuffer);
    return publicUrl;
};

module.exports.cleanBase64 = cleanBase64;
module.exports.extractImage = extractImage;