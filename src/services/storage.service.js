const ImageKit = require("@imagekit/nodejs");

const ImageKitClient = new ImageKit({ privateKey: process.env.IMAGE_KIT });

async function uploadFile(file) {
  const result = await ImageKitClient.files.upload({
    file,
    fileName: "music" + Date.now(),
    folder: "spotify-backend/music",
  });
  return result;
}

module.exports = { uploadFile };
