const express = require("express");
const router = express.Router();
const { QueryTypes, ValidationError } = require("sequelize");
const { models, model } = require("../../sequelize");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const sequelize = require("../../sequelize");
const { authenticate, authenticateSameUser } = require("../../middleware/jwt");
const { MissingField } = require("../../errors");
const { userExists } = require("../../middleware/userCheck");

router.get("", async function (req, res) {
  const user = await models.user.findAll({
    where: {
      [Op.or]: {
        firstName: { [Op.like]: "%" + req.query.searchTerm + "%" },
        lastName: { [Op.like]: "%" + req.query.searchTerm + "%" },
        username: { [Op.like]: "%" + req.query.searchTerm + "%" },
      },
    },
  });

  if (!user || user.length === 0) res.status(404).send();
  else res.status(200).send(user);
});

router.get("/:userIdentifier", authenticate, async function (req, res) {
  let user;

  if (isNaN(parseInt(req.params.userIdentifier)))
    user = await models.user.findOne({
      where: { username: req.params.userIdentifier },
    });
  else
    user = await models.user.findOne({
      where: { id: req.params.userIdentifier },
    });

  if (!user) res.status(404).send();
  else res.status(200).send(user);
});

router.post("/", async function (req, res, next) {
  const requiredFields = ["username", "password", "email"];

  try {
    const missingFields = requiredFields.filter(
      (field) => !req.body.hasOwnProperty(field)
    );
    if (missingFields.length != 0) throw new MissingField(missingFields);

    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newUser = await models.user.create(req.body);

    res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:userId",
  [authenticateSameUser, userExists],
  async function (req, res, next) {
    try {
      await models.user.update(req.body, {
        where: { id: req.params.userId },
      });
      const updatedUser = await models.user.findByPk(req.params.userId);

      res.status(200).send(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:userId",
  [authenticateSameUser, userExists],
  async function (req, res) {
    await models.user.destroy({ where: { id: req.params.userId } });

    res.status(201).send();
  }
);

router.get("/friends/:userId", async function (req, res) {
  const friends = await models.friend.findAll({
    include: { model: models.user, foreignKey: "userOutgoingId" },
    where: { userIncomingId: req.params.userId },
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
