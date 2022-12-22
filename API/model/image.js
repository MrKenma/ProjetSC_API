const sharp = require("sharp");
const getUuid = require("uuid-by-string");

module.exports.getUuidFromEmail = (email) => {
    return getUuid(email);
}

module.exports.saveImage = (imageBuffer, imageName, destFolder, imageType) => {
    return sharp(imageBuffer)
    .jpeg()
    .resize(
        {
            fit: 'inside',
            width: 1920,
            height: 1080
        })
    .toFile(`${destFolder}/${getUuid(imageName)}.${imageType}`);
}

