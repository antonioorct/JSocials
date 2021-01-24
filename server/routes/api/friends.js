const express = require("express");
const { QueryTypes } = require("sequelize");
const router = express.Router();
const { authenticate, authenticateSameUser } = require("../../middleware/jwt");
const sequelize = require("../../sequelize");
const { models } = require("../../sequelize");
const { Op } = require("sequelize");
const { userExists } = require("../../middleware/userCheck");

router.get(
  "/users/:userId/friends",
  authenticate,
  async function (req, res, next) {
    try {
      const friends = await sequelize.query(
        `
                    SELECT 
                  u.id AS id,
                  u.first_name AS firstName,
                  u.last_name AS lastName,
                  u.image_path AS imagePath
              FROM
                  friends AS f
                      LEFT OUTER JOIN
                  users AS u ON f.user2_id = u.id
              WHERE
                f.user1_id = ?;`,
        { type: QueryTypes.SELECT, nest: true, replacements: [req.userId] }
      );

      if (!friends) res.status(404).send();
      else res.status(200).send(friends);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/users/:user1Id/friends/:user2Id",
  authenticate,
  async function (req, res, next) {
    try {
      const user1Id = req.params.user1Id;
      const user2Id = req.params.user2Id;

      const usersExists =
        (await models.user.count({
          where: { id: { [Op.in]: [user1Id, user2Id] } },
        })) === 2;
      if (!usersExists) return res.status(404).send("No users found");

      const isFriend = await models.friend.findOne({
        where: { user1Id: user1Id, user2Id: user2Id },
      });
      if (isFriend) return res.status(200).send({ status: "friends" });

      const isPendingFrom = await models.pendingFriend.findOne({
        where: { userIncomingId: user1Id, userOutgoingId: user2Id },
      });

      if (isPendingFrom)
        return res
          .status(200)
          .send({ status: "pending", direction: "incoming" });
      const isPendingTo = await models.pendingFriend.findOne({
        where: {
          userIncomingId: user2Id,
          userOutgoingId: user1Id,
        },
      });

      if (isPendingTo)
        return res
          .status(200)
          .send({ status: "pending", direction: "outgoing" });

      return res.status(404).send();
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/users/:userId/friends/:friendId",
  [authenticateSameUser, userExists],
  async function (req, res, next) {
    try {
      const userId = req.userId;
      const friendId = req.params.friendId;

      const usersExists =
        (await models.user.count({
          where: { id: friendId },
        })) === 1;
      if (!usersExists) return res.status(404).send("No friend found");

      const friendshipExists =
        (
          await sequelize.query(
            `
      SELECT EXISTS ( SELECT user1_id FROM friends WHERE user1_id = ? AND user2_id = ?) AS exist;`,
            { plain: true, raw: true, replacements: [userId, friendId] }
          )
        ).exist === 1;
      if (!friendshipExists) return res.status(404).send("No friendship found");

      await models.friend.destroy({
        where: { user1Id: userId, user2Id: friendId },
      });
      await models.friend.destroy({
        where: {
          user1Id: friendId,
          user2Id: userId,
        },
      });

      return res.status(200).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
