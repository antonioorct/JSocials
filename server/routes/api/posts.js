const Sequelize = require("sequelize");
const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const { models } = require("../../sequelize");
const { userExists, postExists } = require("../../middleware/userCheck");
const { authenticate, authenticateSameUser } = require("../../middleware/jwt");
const fs = require("fs");
const multer = require("multer")();

router.get(
  "/users/:userId/feed",
  authenticateSameUser,
  async function (req, res, next) {
    try {
      const userId = req.userId;

      const friends = await models.user.findAll({
        include: [{ model: models.user, as: "friends", attributes: ["id"] }],
        where: { id: userId },
      });
      if (!friends) return res.status(404).send();

      const friendIds = friends[0]
        .getDataValue("friends")
        .map((friend) => friend.getDataValue("id"));

      const posts = await models.post.findAll({
        include: [
          {
            model: models.post,
            as: "comments",
            include: [
              {
                model: models.user,
                attributes: ["firstName", "lastName", "username", "id"],
              },
              {
                model: models.userPostLike,
                include: {
                  model: models.user,
                  attributes: ["firstName", "lastName"],
                },
              },
            ],
            limit: 3,
            attributes: { exclude: ["user_id"] },
            order: [["createdAt", "DESC"]],
          },
          {
            model: models.user,
            attributes: ["firstName", "lastName", "username"],
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
          [Op.and]: {
            postId: { [Op.eq]: null },
            [Op.or]: {
              [Op.and]: { private: false, userId: friendIds },
              userId: userId,
            },
          },
        },
        order: [["createdAt", "DESC"]],
      });

      if (!posts) return res.sendStatus(404);
      return res.status(200).send(posts);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/users/:userId/posts",
  [authenticate, userExists],
  async function (req, res, next) {
    try {
      const userId = req.params.userId;

      const posts = await models.post.findAll({
        include: [
          {
            model: models.post,
            as: "comments",
            include: [
              {
                model: models.user,
                attributes: ["firstName", "lastName", "username", "id"],
              },
              {
                model: models.userPostLike,
                include: {
                  model: models.user,
                  attributes: ["firstName", "lastName"],
                },
              },
            ],
            limit: 3,
            attributes: { exclude: ["user_id"] },
            order: [["createdAt", "DESC"]],
          },
          {
            model: models.user,
            attributes: ["firstName", "lastName", "username"],
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
          postId: { [Op.eq]: null },
          userId: userId,
          private: userId === req.userId ? null : false,
        },
        order: [["createdAt", "DESC"]],
      });

      if (!posts) return res.sendStatus(404);
      return res.status(200).send(posts);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/posts/:postId",
  [authenticate, postExists],
  async function (req, res, next) {
    try {
      const post = await models.post.findByPk(req.params.postId, {
        include: [
          {
            model: models.post,
            as: "comments",
            include: [
              {
                model: models.user,
                attributes: ["id", "firstName", "lastName", "imagePath"],
              },
              {
                model: models.userPostLike,
                include: {
                  model: models.user,
                  attributes: ["firstName", "lastName"],
                },
              },
            ],
            attributes: { exclude: ["userId", "postId"] },
          },
          {
            model: models.user,
            attributes: ["id", "firstName", "lastName", "imagePath"],
          },
          {
            model: models.userPostLike,
            include: {
              model: models.user,
              attributes: ["firstName", "lastName"],
            },
          },
        ],
        attributes: { exclude: ["postId"] },
        order: [[Sequelize.col("comments.created_at"), "DESC"]],
      });
      if (
        post.getDataValue("private") &&
        req.userId !== post.getDataValue("userId")
      )
        return res.status(403).send("Access denied.");

      res.status(200).send(post);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/posts",
  [authenticate, multer.single("image")],
  async function (req, res, next) {
    try {
      const newPost = await models.post.create({
        body: req.body.body,
        private: false || req.body.private,
        userId: req.userId,
        imagePath: req.file ? req.file.originalname : null,
      });
      const newFullPost = await models.post.findByPk(newPost.id, {
        include: [
          {
            model: models.user,
            attributes: ["id", "firstName", "lastName", "imagePath"],
          },
        ],
        attributes: { exclude: ["postId"] },
      });
      newFullPost.setDataValue("comments", []);
      newFullPost.setDataValue("userPostLikes", []);

      if (req.file)
        fs.writeFile(
          "C:\\College\\Zavrsni\\Projekt\\client\\public\\img\\" +
            req.file.originalname,
          req.file.buffer
        );

      res.status(201).send(newFullPost);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/posts/:postId",
  [authenticate, postExists],
  async function (req, res, next) {
    try {
      const postId = req.params.postId;

      const userOwnsPost =
        (await models.post.findByPk(postId)).userId === req.userId;
      if (!userOwnsPost) return res.status(403).send("Access denied.");

      await models.post.update(
        { body: req.body.body },
        { where: { id: postId } }
      );
      const updatedPost = await models.post.findByPk(postId);

      res.status(200).send(updatedPost);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/posts/:postId",
  [authenticate, postExists],
  async function (req, res, next) {
    try {
      const postId = req.params.postId;

      const userOwnsPost =
        (await models.post.findByPk(postId)).userId === req.userId;
      if (!userOwnsPost) return res.status(403).send("Access denied.");

      await models.post.destroy({ where: { id: postId } });

      res.status(200).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
