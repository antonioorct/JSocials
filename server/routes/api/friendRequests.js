const { MissingField, BadRequest, NotFound } = require("../../errors");
const express = require("express");
const { authenticate, authenticateSameUser } = require("../../middleware/jwt");
const router = express.Router();
const { models } = require("../../sequelize");
const sequelize = require("../../sequelize");
const { QueryTypes } = require("sequelize");

router.get(
  "/users/:userId/friend-requests",
  authenticateSameUser,
  async function (req, res, next) {
    try {
      const userId = req.userId;
      const direction = req.query.direction;
      if (!direction) throw new MissingField(["direction"]);

      let pendingFriends = { incoming: [], outgoing: [] };
      switch (direction) {
        case "both":
          pendingFriends.outgoing = await sequelize.query(
            `
      				SELECT 
          users.id "id",
					users.first_name "firstName",
          users.last_name "lastName",
          users.image_path "imagePath"
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
          pendingFriends.incoming = await sequelize.query(
            `
      				SELECT 
          users.id "id",
					users.first_name "firstName",
					users.last_name "lastName",
          users.image_path "imagePath"
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
          pendingFriends = await models.user.findAll({
            include: {
              model: models.pendingFriend,
              where: { userIncomingId: userId },
              foreignKey: "userOutgoingId",
              as: "outgoing",
              attributes: [],
            },
            attributes: ["id", "firstName", "lastName", "imagePath"],
          });
          break;
        case "outgoing":
          pendingFriends = await models.user.findAll({
            include: {
              model: models.pendingFriend,
              where: { userOutgoingId: userId },
              foreignKey: "userIncomingId",
              as: "incoming",
              attributes: [],
            },
            attributes: ["id", "firstName", "lastName", "imagePath"],
          });
          break;
        default:
          throw new BadRequest("Invalid direction query");
      }

      res.status(200).send(pendingFriends);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/friend-requests", authenticate, async function (req, res, next) {
  try {
    if (!req.body.friendId) throw new MissingField(["friendId"]);
    else if (req.body.friendId == req.userId)
      throw new BadRequest("Invalid friendId");

    const userExists = await models.user.findByPk(req.body.friendId);
    if (!userExists) throw new NotFound("User not found");

    const requestExists = await models.pendingFriend.findOne({
      where: { userOutgoingId: req.body.friendId, userIncomingId: req.userId },
    });
    if (requestExists) throw new BadRequest("Friend request already exists");
    const friendsExists = await models.friend.findOne({
      where: { user1Id: req.userId, user2Id: req.body.friendId },
    });
    if (friendsExists) throw new BadRequest("Friendship already exists");

    const newRequest = await models.pendingFriend.create({
      userOutgoingId: req.userId,
      userIncomingId: req.body.friendId,
    });

    res.status(201).send(newRequest);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/friend-requests/:pendingFriendId",
  authenticate,
  async function (req, res, next) {
    try {
      const friendRequest = await models.pendingFriend.findByPk(
        req.params.pendingFriendId
      );
      if (friendRequest.userIncomingId !== req.userId)
        return res.status(403).send("Access denied.");

      await models.pendingFriend.destroy({
        where: { id: req.params.pendingFriendId },
      });

      await models.friend.create({
        user1Id: req.userId,
        user2Id: friendRequest.userOutgoingId,
      });
      await models.friend.create({
        user1Id: friendRequest.userOutgoingId,
        user2Id: req.userId,
      });

      res.status(201).send();
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/friend-requests/:pendingFriendId",
  authenticate,
  async function (req, res, next) {
    try {
      const friendRequest = await models.pendingFriend.findByPk(
        req.params.pendingFriendId
      );

      if (!friendRequest)
        return res.status(404).send("No friend request found.");
      else if (
        !(
          friendRequest.userOutgoingId === req.userId ||
          friendRequest.userIncomingId === req.userId
        )
      )
        return res.status(403).send("Access denied.");

      await models.pendingFriend.destroy({
        where: { id: req.params.pendingFriendId },
      });

      res.status(200).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
