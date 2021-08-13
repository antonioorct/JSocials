const path = require("path");
const fs = require("fs");

function getFilePath(filename) {
  return `${process.env.ASSETS_SAVE_LOCATION}/${filename}`;
}

function removeFile(filePath) {
  const fullFilePath = path.join(__dirname, "..", filePath);

  try {
    fs.unlinkSync(fullFilePath);
  } catch (err) {
    console.error("Failed in deleting file: " + filePath);
  }
}

module.exports = { removeFile, getFilePath };
