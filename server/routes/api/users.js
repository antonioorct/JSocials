const express = require("express");
const router = express.Router();
const { models } = require("../../sequelize");
const bcrypt = require("bcrypt");

router.get("/", async function (req, res, next) {
  const users = await models.user.findAll();
  res.send(users);
});

router.get("/:username", async function (req, res, next) {
  const user = await models.user.findOne({
    where: { username: req.params.username },
  });

  if (user.length === 0) res.status(404).send();
  else res.send(user);
});

router.post("/", async function (req, res, next) {
  try {
    req.body["password"] = await bcrypt.hash(req.body["password"], 10);
    const newUser = await models.user.create(req.body);

    res.status(201).send(newUser);
  } catch (e) {
    res.status(400).send("Error creating user:\n" + e.message);
  }
});

module.exports = router;
