const express = require("express");
const router = express.Router();
const {
  postNotPrivate,
  postExists,
  commentExists,
} = require("../../middleware/userCheck");
const { authenticate } = require("../../middleware/jwt");
const { models } = require("../../sequelize");

router.get(
  "/posts/:postId/comments",
  [authenticate, postExists, postNotPrivate],
  async function (req, res, next) {
    try {
      const comments = await models.comment.findAll({
        where: { postId: req.params.postId },
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
  async function (req, res) {
    try {
      const newComment = await models.comment.create({
        body: req.body.body,
        postId: req.params.postId,
      });

      res.status(201).send(newComment);
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

      return res.status(200).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
