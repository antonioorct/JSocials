const { Router } = require("express");
const { Op, Sequelize } = require("sequelize");
const { sequelize } = require("../database");
const { authenticate } = require("../utils/jwt");
const logger = require("../logger");

const router = Router();

const FRIEND_OPTIONS = (userId) => ({
  include: {
    model: sequelize.models.user,
    as: "friends",
    where: { id: userId },
  },
});

router.get("/friends", authenticate, async (req, res) => {
  try {
    const friends = await sequelize.models.user.findAll(
      FRIEND_OPTIONS(req.userId)
    );

    return res.send(friends);
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.get("/friends/suggestions", authenticate, async (req, res) => {
  try {
    const { userId } = req;

    // Find all friends, incoming & outgoing requests and then find all users
    // which don't include the found users
    // FIXME: compress all of these multiple queries and maps to a single one
    const friends = await sequelize.models.user.findAll(FRIEND_OPTIONS(userId));

    const outgoingFriendRequests = await sequelize.models.user.findAll({
      include: [
        {
          model: sequelize.models.user,
          as: "outgoing_users",
          where: { id: userId },
        },
      ],
    });
    const incomingFriendRequests = await sequelize.models.user.findAll({
      include: [
        {
          model: sequelize.models.user,
          as: "incoming_users",
          where: { id: userId },
        },
      ],
    });

    const notFriends = await sequelize.models.user.findAll({
      limit: 5,
      order: Sequelize.literal("rand()"),
      where: {
        id: {
          [Op.notIn]: [
            ...friends.map((friend) => friend.id),
            ...outgoingFriendRequests.map((request) => request.id),
            ...incomingFriendRequests.map((request) => request.id),
            userId,
          ],
        },
      },
    });

    return res.send(notFriends);
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.get("/friends/:friendId", authenticate, async (req, res) => {
  try {
    const { friendId } = req.params;
    const { userId } = req;

    const friend = await sequelize.models.friend.findOne({
      where: { userId, friendId },
    });

    if (friend) return res.send("friends");

    const outgoing = await sequelize.models.friend_request.findOne({
      where: {
        incoming_user_id: friendId,
        outgoing_user_id: userId,
      },
    });
    if (outgoing) return res.send("outgoing");

    const incoming = await sequelize.models.friend_request.findOne({
      where: {
        incoming_user_id: userId,
        outgoing_user_id: friendId,
      },
    });
    if (incoming) return res.send("incoming");

    return res.send("none");
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.post("/friends/:outgoing_user_id", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { outgoing_user_id } = req.params;

    await sequelize.models.friend_request.destroy({
      where: { outgoing_user_id },
    });

    await sequelize.models.friend.bulkCreate([
      { userId, friendId: outgoing_user_id },
      { userId: outgoing_user_id, friendId: userId },
    ]);

    return res.send();
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.delete("/friends/:friendId", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const friendId = req.params.friendId;

    await sequelize.models.friend.destroy({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });

    return res.send();
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err.message);
  }
});

module.exports = router;
