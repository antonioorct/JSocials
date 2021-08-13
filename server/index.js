const express = require("express");
const app = express();
const port =
  process.env.NODE_ENV === "production"
    ? process.env.PORT
    : process.env.REACT_APP_SERVER_PORT || 3000;
const database = require("./database");
const logger = require("./logger");
const socket = require("./socket");
const router = require("./router");
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(cors());

database.init();
router.init(app);
const httpServer = socket.init(app);

app.get(`/${process.env.ASSETS_SAVE_LOCATION}/*`, (req, res) => {
  res.sendFile(require("path").join(__dirname, req.path));
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("front-end"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "front-end", "index.html"));
  });
}

app.all("*", (req, res) => {
  res.status(404).send(`${req.originalUrl} not found.`);
});

httpServer.listen(port, () => {
  logger.info(`Example app listening at http://localhost:${port}`);
});
