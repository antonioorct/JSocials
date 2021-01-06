const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const { models, model } = require("../../sequelize");

router.get("/", async function (req, res, next) {
  const posts = await models.post.findAll();

  console.log("returning ", posts);
  res.send(posts);
});

router.get("/:userId", async function (req, res, next) {
  const posts = await models.post.findAll({
    include: [
      {
        model: models.post,
        as: "comments",
        include: [
          { model: models.user, attributes: ["firstName", "lastName"] },
          {
            model: models.userPostLike,
            include: {
              model: models.user,
              attributes: ["firstName", "lastName"],
            },
          },
        ],
        attributes: { exclude: ["userId"] },
      },
      { model: models.user, attributes: ["firstName", "lastName"] },
      {
        model: models.userPostLike,
        include: { model: models.user, attributes: ["firstName", "lastName"] },
      },
    ],
    where: { userId: req.params.userId, postId: { [Op.eq]: null } },
    attributes: { exclude: ["postId"] },
  });

  console.log("returning ", posts);
  if (!posts) return res.sendStatus(404);
  else return res.status(200).send(posts);
});

router.post("/", async function (req, res, next) {
  try {
    const newPost = await models.post.create(req.body);

    res.status(201).send(newPost);
  } catch (e) {
    res.status(400).send("Error creating user:\n" + e.message);
  }
});

router.post("/:postId", async function (req, res) {
  try {
    const newComment = await models.post.create(req.body);
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

router.post("/:postId/:userId", async function (req, res, next) {
  const newLike = await models.userPostLike.create({
    postId: req.params.postId,
    userId: req.params.userId,
  });

  return res.status(200).send();
});

router.delete("/:postId/:userId", async function (req, res, next) {
  const newLike = await models.userPostLike.destroy({
    where: { postId: req.params.postId, userId: req.params.userId },
  });

  return res.status(200).send();
});

module.exports = router;
