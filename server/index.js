const express = require("express");
const app = express();
const port = process.env.SERVER_PORT || 3000;
const { init } = require("./database");

init();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
