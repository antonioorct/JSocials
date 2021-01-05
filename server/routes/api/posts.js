const express = require("express");
const router = express.Router();
const { models } = require("../../sequelize");
const sequelize = require("../../sequelize");

router.get("/", async function (req, res, next) {
  const posts = await models.post.findAll();

  console.log("returning ", posts);
  res.send(posts);
});

router.get("/:userId", async function (req, res, next) {
  const posts = await models.post.findAll({
    include: [
      { model: models.comment, include: [{ model: models.user }] },
      { model: models.user },
    ],
    where: { userId: req.params.userId },
  });

  console.log("returning ", posts);
  if (!posts) res.sendStatus(404);
  else res.send(posts);
});

router.post("/", async function (req, res, next) {
  try {
    const newPost = await models.post.create(req.body);

    res.status(201).send(newPost);
  } catch (e) {
    res.status(400).send("Error creating user:\n" + e.message);
  }
});

module.exports = router;
