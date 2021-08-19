const { Router } = require("express");
const { sequelize } = require("../database");
const { authenticate } = require("../utils/jwt");
const logger = require("../logger");
const { io } = require("../socket");

const router = Router();

const INCOMING_REQUEST_OPTIONS = (userId) => ({
  include: [
    {
      model: sequelize.models.user,
      as: "incoming_users",
      where: { id: userId },
    },
  ],
});

const OUTGOING_REQUEST_OPTIONS = (userId) => ({
  include: [
    {
      model: sequelize.models.user,
      as: "outgoing_users",
      where: { id: userId },
    },
  ],
});

router.get("/friend-requests", authenticate, async (req, res) => {
  try {
    const incoming = await sequelize.models.user.findAll(
      INCOMING_REQUEST_OPTIONS(req.userId)
    );

    const outgoing = await sequelize.models.user.findAll(
      OUTGOING_REQUEST_OPTIONS(req.userId)
    );

    return res.send({ incoming, outgoing });
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.get("/friend-requests/count", authenticate, async (req, res) => {
  try {
    const friendRequestCount = await sequelize.models.user.count(
      INCOMING_REQUEST_OPTIONS(req.userId)
    );

    return res.send(friendRequestCount.toString());
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.post("/friend-requests/:friendId", authenticate, async (req, res) => {
  try {
    const { friendId } = req.params;
    const { userId } = req;

    await sequelize.models.friend_request.create({
      incoming_user_id: friendId,
      outgoing_user_id: userId,
    });

    const user = await sequelize.models.user.findByPk(userId);

    io().to(friendId).emit("friend", user);

    return res.send();
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.put("/friend-requests", authenticate, async (req, res) => {
  try {
    const { userId } = req;
    const { outgoing_user_id, incoming_user_id } = req.body;
    const queryOptions = outgoing_user_id
      ? {
        where: { incoming_user_id: userId, outgoing_user_id },
      }
      : {
        where: { incoming_user_id, outgoing_user_id: userId },
      };

    await sequelize.models.friend_request.destroy(queryOptions);

    return res.send();
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err.message);
  }
});

module.exports = router;
