const express = require("express");
const router = express.Router();
const { models, model } = require("../../sequelize");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

router.get("", async function (req, res, next) {
  let user = [];
  if (req.query.firstName)
    user = await models.user.findAll({
      where: {
        firstName: { [Op.like]: "%" + req.query.firstName + "%" },
      },
    });
  else if (req.query.username)
    user = await models.user.findOne({
      where: {
        username: { [Op.like]: "%" + req.query.username + "%" },
      },
    });

  if (!user || user.length === 0) res.status(404).send();
  else res.send(user);
});

router.get("/", async function (req, res, next) {
  const users = await models.user.findAll();
  res.send(users);
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

router.post("/friends", async function (req, res) {
  if (req.query.accept) {
    try {
      await models.pendingFriend.destroy({
        where: { user1Id: req.body.user2Id, user2Id: req.body.user1Id },
      });

      if (!req.query.accept)
        return res.status(200).send("Friend request denied");

      await models.friend.create(req.body);
      const newRequest = await models.friend.create({
        user1Id: req.body.user2Id,
        user2Id: req.body.user1Id,
      });
      res.status(201).send(newRequest);
    } catch (e) {
      res.status(400).send("Error creating user:\n" + e.message);
    }
  } else {
    const newRequest = await models.pendingFriend.create(req.body);

    res.status(201).send(newRequest);
  }
});

module.exports = router;
