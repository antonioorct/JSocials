const express = require("express");
const app = express();
const port = process.env.REACT_APP_SERVER_PORT || 3000;
const database = require("./database");
const logger = require("./logger");
const socket = require("./socket");
const router = require("./router");
const cors = require("cors");

app.use(express.json());
app.use(cors());

database.init();
router.init(app);
socket.init(app);

app.get(`/${process.env.ASSETS_SAVE_LOCATION}/*`, (req, res) => {
  res.sendFile(require("path").join(__dirname, req.path));
});

app.all("*", (req, res) => {
  res.status(404).send(`${req.originalUrl} not found.`);
});

app.listen(port, () => {
  logger.info(`Example app listening at http://localhost:${port}`);
});
