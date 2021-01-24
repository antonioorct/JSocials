const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middleware/jwt");
const { userExists } = require("../../middleware/userCheck");
const { models } = require("../../sequelize");
const { Op } = require("sequelize");

router.get(
  "/users/:userId/images",
  [authenticate, userExists],
  async function (req, res, next) {
    try {
      let images;
      if (req.userId == req.params.userId)
        images = await models.post.findAll({
          where: { userId: req.params.userId, imagePath: { [Op.ne]: null } },
          order: [["createdAt", "DESC"]],
          attributes: ["id", "imagePath"],
        });
      else
        images = await models.post.findAll({
          where: {
            userId: req.params.userId,
            private: false,
            imagePath: { [Op.ne]: null },
          },
          order: [["createdAt", "DESC"]],
          attributes: ["id", "imagePath"],
        });

      if (!images) return res.status(404).send();
      return res.status(200).send(images);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
