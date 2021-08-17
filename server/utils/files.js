const path = require("path");
const fs = require("fs");
const logger = require("../logger");

function getFilePath(filename) {
  return `${process.env.ASSETS_SAVE_LOCATION}/${filename}`;
}

function removeFile(filePath) {
  const fullFilePath = path.join(__dirname, "..", filePath);

  try {
    fs.unlinkSync(fullFilePath);
  } catch (err) {
    logger.error("Failed in deleting file: " + filePath);
  }
}

module.exports = { removeFile, getFilePath };
