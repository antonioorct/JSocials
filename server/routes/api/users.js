const express = require("express");
const router = express.Router();
const { QueryTypes } = require("sequelize");
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

router.put("/:userId", async function (req, res) {
  await models.user.update(req.body, {
    where: { id: req.params.userId },
  });
  const updatedUser = await models.user.findByPk(req.params.userId);

  res.status(200).send(updatedUser);
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
  const userId = req.params.userId;
  const include = req.query.include;

  let friendRequests = { incoming: [], outgoing: [] };
  switch (include) {
    case "all":
      friendRequests.outgoing = await sequelize.query(
        `
      				SELECT 
          users.id "id",
					users.first_name "firstName",
          users.last_name "lastName"
				FROM
					pending_friends
						INNER JOIN
					users ON pending_friends.user_incoming_id = users.id
				WHERE
					user_outgoing_id = ?;
      `,
        {
          type: QueryTypes.SELECT,
          replacements: [userId],
        }
      );
      friendRequests.incoming = await sequelize.query(
        `
      				SELECT 
          users.id "id",
					users.first_name "firstName",
					users.last_name "lastName"
				FROM
					pending_friends
						INNER JOIN
					users ON pending_friends.user_outgoing_id = users.id
				WHERE
					user_incoming_id = ?;
      `,
        {
          type: QueryTypes.SELECT,
          replacements: [userId],
        }
      );
      break;
    case "incoming":
      friendRequests = await models.pendingFriend.findAll({
        include: { model: models.user, foreignKey: "userIncomingId" },
        where: { userOutgoingId: userId },
      });
      break;
    case "outgoing":
      friendRequests = await models.pendingFriend.findAll({
        include: { model: models.user, foreignKey: "userOutgoingId" },
        where: { userIncomingId: userId },
      });
      break;
  }
  console.log(friendRequests);

  res.status(200).send(friendRequests);
});

router.post("/friends", async function (req, res) {
  if (req.query.accept) {
    try {
      await models.pendingFriend.destroy({
        where: {
          userIncomingId: req.body.user2Id,
          userOutgoingId: req.body.user1Id,
        },
      });
      await models.pendingFriend.destroy({
        where: {
          userIncomingId: req.body.user1Id,
          userOutgoingId: req.body.user2Id,
        },
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
  const userIncomingId = req.query.userIncomingId;
  const userOutgoingId = req.query.userOutgoingId;

  await models.pendingFriend.destroy({
    where: { userIncomingId: userIncomingId, userOutgoingId },
  });

  await models.friend.destroy({
    where: { user1Id: userIncomingId, user2Id: userOutgoingId },
  });
  await models.friend.destroy({
    where: {
      user1Id: userOutgoingId,
      user2Id: userIncomingId,
    },
  });

  return res.status(200).send();
});

router.get("/friends/:user1Id/status", async function (req, res) {
  const userIncomingId = req.params.user1Id;
  const userOutgoingId = req.query.user2Id;

  const isFriend = await models.friend.findOne({
    where: { user1Id: userIncomingId, user2Id: userOutgoingId },
  });

  if (isFriend) return res.status(201).send({ status: "friends" });
  else {
    const isPendingFrom = await models.pendingFriend.findOne({
      where: { userIncomingId, userOutgoingId },
    });

    if (isPendingFrom) return res.status(202).send({ status: "pending from" });
    const isPendingTo = await models.pendingFriend.findOne({
      where: { userIncomingId: userOutgoingId, userOutgoingId: userIncomingId },
    });

    if (isPendingTo) return res.status(202).send({ status: "pending to" });

    return res.status(203).send({ status: "not friends" });
  }
});

module.exports = router;
