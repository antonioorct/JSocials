const { Router } = require("express");
const { Op } = require("sequelize");
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
