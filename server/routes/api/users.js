const express = require("express");
const router = express.Router();
const { models, model } = require("../../sequelize");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const sequelize = require("../../sequelize");

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

router.get("/friends/:userId", async function (req, res) {
  const friends = await models.friend.findAll({
    include: { model: models.user, foreignKey: "user2Id" },
    where: { user1Id: req.params.userId },
  });

  if (!friends || friends.length === 0) res.status(404).send();
  res.status(200).send(friends);
});

router.get("/friends/:userId/pending", async function (req, res) {
  const friendRequests = await models.pendingFriend.findAll({
    include: { model: models.user, foreignKey: "user1Id" },
    where: { user2Id: req.params.userId },
  });

  res.status(200).send(friendRequests);
});

router.post("/friends", async function (req, res) {
  if (req.query.accept) {
    try {
      await models.pendingFriend.destroy({
        where: { user1Id: req.body.user2Id, user2Id: req.body.user1Id },
      });

      if (req.query.accept === "false")
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

router.delete("/friends", async function (req, res) {
  const user1Id = req.query.user1Id;
  const user2Id = req.query.user2Id;

  await models.pendingFriend.destroy({
    where: { user1Id, user2Id },
  });

  await models.friend.destroy({
    where: { user1Id, user2Id },
  });
  await models.friend.destroy({
    where: { user1Id: req.query.user2Id, user2Id: req.query.user1Id },
  });

  return res.status(200).send();
});

router.get("/friends/:user1Id/status", async function (req, res) {
  const user1Id = req.params.user1Id;
  const user2Id = req.query.user2Id;

  console.log("test");
  const isFriend = await models.friend.findOne({
    where: { user1Id, user2Id },
  });

  if (isFriend) return res.status(201).send({ status: "friends" });
  else {
    const isPendingTo = await models.pendingFriend.findOne({
      where: { user1Id, user2Id },
    });

    if (isPendingTo) return res.status(202).send({ status: "pending to" });
    const isPendingFrom = await models.pendingFriend.findOne({
      where: { user1Id: user2Id, user2Id: user1Id },
    });

    if (isPendingFrom) return res.status(202).send({ status: "pending from" });

    return res.status(203).send({ status: "not friends" });
  }
});

module.exports = router;
