const express = require("express");
const app = express();
const port = process.env.SERVER_PORT || 3000;
const database = require("./database");
const logger = require("./logger");

database.init();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  logger.info(`Example app listening at http://localhost:${port}`);
});
