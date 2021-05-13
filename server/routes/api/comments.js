const express = require("express");
const router = express.Router();
const {
  postNotPrivate,
  postExists,
  commentExists,
} = require("../../middleware/userCheck");
const { authenticate } = require("../../middleware/jwt");
const { models } = require("../../sequelize");
const { Op } = require("sequelize");

router.get(
  "/posts/:postId/comments",
  [authenticate, postExists, postNotPrivate],
  async function (req, res, next) {
    try {
      const limit = parseInt(req.query.limit);
      const createdAt = req.query.createdAt || new Date(Date.now());

      const comments = await models.post.findAll({
        include: [
          {
            model: models.user,
            attributes: ["id", "firstName", "lastName", "username"],
          },
          {
            model: models.userPostLike,
            include: {
              model: models.user,
              attributes: ["firstName", "lastName"],
            },
          },
        ],
        where: {
          postId: req.params.postId,
          createdAt: { [Op.lt]: createdAt },
        },
        limit: limit || null,
        order: [["createdAt", "DESC"]],
      });

      if (!comments) return res.status(404).send();

      return res.status(200).send(comments);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/posts/:postId/comments",
  [authenticate, postExists, postNotPrivate],
  async function (req, res, next) {
    try {
      const newComment = await models.post.create({
        userId: req.userId,
        body: req.body.body,
        postId: req.params.postId,
      });

      const newFullComment = await models.post.findByPk(newComment.id, {
        include: [
          {
            model: models.user,
            attributes: ["id", "firstName", "lastName", "username"],
          },
          {
            model: models.userPostLike,
            include: {
              model: models.user,
              attributes: ["firstName", "lastName"],
            },
          },
        ],
      });

      await models.post.increment("numComments", {
        where: { id: req.params.postId },
      });

      res.status(201).send(newFullComment);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/comments/:commentId",
  [authenticate, commentExists],
  async function (req, res, next) {
    try {
      if (req.comment.userId !== req.userId)
        return res.status(403).send("Access denied.");

      await models.post.update(
        { body: req.body.body },
        { where: { id: req.params.commentId } }
      );

      const updatedComment = await models.post.findByPk(req.params.commentId);

      return res.status(200).send(updatedComment);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/comments/:commentId",
  [authenticate, commentExists],
  async function (req, res, next) {
    try {
      if (req.comment.userId !== req.userId)
        return res.status(403).send("Access denied.");

      await models.post.destroy({ where: { id: req.params.commentId } });
      await models.post.decrement("numComments", {
        where: { id: req.comment.postId },
      });

      return res.status(200).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
