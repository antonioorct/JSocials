var express = require("express");
var router = express.Router();
var { models } = require("../sequelize");

router.get("/", async function (req, res, next) {
  const users = await models.user.findAll();
  console.log(`sent ${users[0]}`);
  res.send(users);
});

router.post("/", async function (req, res, next) {
  console.log(req.body);
  try {
    const newUser = await models.user.create(req.body);

    res.status(201).send(newUser);
  } catch (e) {
    res.status(400).send("Error creating user:\n" + e.message);
  }
});

module.exports = router;
