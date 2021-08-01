const express = require("express");
const app = express();
const port = process.env.SERVER_PORT || 3000;
const database = require("./database");
const logger = require("./logger");
const router = require("./router");

database.init();
router.init(app);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  logger.info(`Example app listening at http://localhost:${port}`);
});
