const express = require("express");
const { Op } = require("sequelize");
const sequelize = require("../../sequelize");
const router = express.Router();
const { models, model, Sequelize } = require("../../sequelize");

router.get("", async function (req, res) {
  const userId = req.query.userId;

  const friends = await models.user.findAll({
    include: [{ model: models.user, as: "friends", attributes: ["id"] }],
    where: { id: userId },
  });

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
            attributes: ["firstName", "lastName", "id"],
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
        attributes: ["firstName", "lastName"],
      },
      {
        model: models.userPostLike,
        include: { model: models.user, attributes: ["firstName", "lastName"] },
      },
    ],
    where: {
      postId: { [Op.eq]: null },
      userId: { [Op.in]: [...friendIds, userId] },
    },
    order: [["createdAt", "DESC"]],
  });

  if (!posts) return res.sendStatus(404);
  else return res.status(200).send(posts);
});

router.get("/:postId", async function (req, res) {
  const createdAt = req.query.createdAt;

  const comments = await models.post.findAll({
    include: [
      {
        model: models.userPostLike,
        include: {
          model: models.user,
          attributes: ["firstName", "lastName"],
        },
      },
      { model: models.user, attributes: ["firstName", "lastName", "id"] },
    ],
    where: {
      createdAt: { [Op.lt]: createdAt },
      postId: req.params.postId,
      postId: { [Op.ne]: null },
    },
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  if (!comments) return res.sendStatus(404);
  else return res.status(200).send(comments);
});

router.post("/", async function (req, res) {
  try {
    const newPost = await models.post.create(req.body);
    const newFullPost = await models.post.findByPk(newPost.getDataValue("id"), {
      include: [{ model: models.user, attributes: ["firstName", "lastName"] }],
      attributes: { exclude: ["postId"] },
    });
    newFullPost.setDataValue("comments", []);
    newFullPost.setDataValue("userPostLikes", []);

    res.status(201).send(newFullPost);
  } catch (e) {
    res.status(400).send("Error creating user:\n" + e.message);
  }
});

router.post("/:postId", async function (req, res) {
  try {
    const newComment = await models.post.create(req.body);
    await models.post.increment("numComments", {
      where: { id: newComment.getDataValue("postId") },
    });
    const newFullComment = await models.post.findByPk(
      newComment.getDataValue("id"),
      {
        include: [
          {
            model: models.userPostLike,
            include: {
              model: models.user,
              attributes: ["firstName", "lastName"],
            },
          },
          { model: models.user },
        ],
      }
    );

    res.status(201).send(newFullComment);
  } catch (e) {
    console.log(e);
    res.status(400).send("Error creating user:\n" + e.message);
  }
});

router.delete("/:postId", async function (req, res) {
  const deletedPost = await models.post.findByPk(req.params.postId);
  await models.post.destroy({
    where: { id: req.params.postId },
  });
  if (deletedPost.getDataValue("postId"))
    await models.post.decrement("numComments", {
      where: { id: deletedPost.getDataValue("postId") },
    });

  return res.status(200).send();
});

router.post("/:postId/:userId", async function (req, res) {
  const newLike = await models.userPostLike.create({
    postId: req.params.postId,
    userId: req.params.userId,
  });

  return res.status(200).send();
});

router.delete("/:postId/:userId", async function (req, res) {
  const newLike = await models.userPostLike.destroy({
    where: { postId: req.params.postId, userId: req.params.userId },
  });

  return res.status(200).send();
});

module.exports = router;
