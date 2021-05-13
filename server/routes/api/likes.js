const express = require("express");
const router = express.Router();
const { postExists, postNotPrivate } = require("../../middleware/userCheck");
const { authenticate } = require("../../middleware/jwt");
const { models } = require("../../sequelize");

router.post(
  "/posts/:postId/likes",
  [authenticate, postExists, postNotPrivate],
  async function (req, res, next) {
    try {
      await models.userPostLike.create({
        postId: req.params.postId,
        userId: req.userId,
      });

      return res.status(200).send();
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/posts/:postId/likes",
  [authenticate, postExists, postNotPrivate],
  async function (req, res, next) {
    try {
      await models.userPostLike.destroy({
        where: {
          postId: parseInt(req.params.postId),
          userId: req.userId,
        },
      });

      return res.status(200).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
