const sharp = require("sharp");
const fs = require("fs");
const getUuid = require("uuid-by-string");

module.exports.getUuidFromEmail = (email) => {
    return getUuid(email);
}

module.exports.saveImage = async (imageBuffer, imageName, destFolder) => {

    if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder);
    }

    return sharp(imageBuffer)
    .jpeg()
    .resize(
        {
            fit: 'inside',
            width: 1920,
            height: 1080
        })
    .toFile(`${destFolder}/${getUuid(imageName)}.jpeg`);
}

module.exports.savePDF = async (pdfBuffer, pdfName, destFolder) => {

    if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder);
    }

    return fs.writeFileSync(`${destFolder}/${getUuid(pdfName)}.pdf`, pdfBuffer);
}

module.exports.deleteFile = async (destFolder, name, type) => {
    return fs.unlinkSync(`${destFolder}/${getUuid(name)}.${type}`);
}



