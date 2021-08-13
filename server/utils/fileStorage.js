const fs = require("fs");
const multer = require("multer");
const path = require("path");

const MULTER_SAVE_LOCATION = path.join(
  __dirname,
  "..",
  process.env.ASSETS_SAVE_LOCATION
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    !fs.existsSync(MULTER_SAVE_LOCATION) && fs.mkdirSync(MULTER_SAVE_LOCATION);

    return cb(null, MULTER_SAVE_LOCATION);
  },
  filename: (req, file, cb) =>
    cb(
      null,
      `${file.originalname.split(".")[0]}_${Date.now()}.${
        file.originalname.split(".")[1]
      }`
    ),
});

const upload = multer({ storage });

module.exports = { attachment: upload.single("attachment") };
