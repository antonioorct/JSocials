const { Router } = require("express");
const { Op } = require("sequelize");
const { sequelize } = require("../database");
const logger = require("../logger");
const { attachment } = require("../utils/fileStorage");
const { authenticate } = require("../utils/jwt");

const router = Router();

router.get("/posts", authenticate, async (req, res) => {
  const posts = await sequelize.models.post.findAll({
    where: {
      postId: { [Op.eq]: null },
    },
    include: [
      sequelize.models.user,
      {
        model: sequelize.models.post,
        as: "comments",
        include: [
          sequelize.models.user,
          {
            model: sequelize.models.user,
            through: sequelize.models.user_post_likes,
            as: "likes",
          },
        ],
      },
      {
        model: sequelize.models.user,
        through: sequelize.models.user_post_likes,
        as: "likes",
      },
    ],
    order: [["id", "DESC"]],
  });

  return res.send(posts);
});

router.post("/posts", [authenticate, attachment], async (req, res) => {
  try {
    const newPost = await sequelize.models.post.create({
      ...req.body,
      attachment: req.file
        ? process.env.ASSETS_SAVE_LOCATION + "/" + req.file.filename
        : undefined,
      userId: req.userId,
    });

    const newReturnPost = await sequelize.models.post.findByPk(newPost.id, {
      include: [
        sequelize.models.user,
        { model: sequelize.models.post, as: "comments" },
      ],
    });

    return res.send(newReturnPost);
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.post("/posts/:postId", authenticate, async (req, res) => {
  const { postId } = req.params;

  try {
    const { content } = req.body;

    const newComment = await sequelize.models.post.create({
      content,
      userId: req.userId,
      postId,
    });

    const newReturnComment = await sequelize.models.post.findByPk(
      newComment.id,
      {
        include: sequelize.models.user,
      }
    );

    return res.send(newReturnComment);
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.delete("/posts/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    await sequelize.models.post.destroy({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });

    return res.send();
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.post("/posts/:postId/like", authenticate, async (req, res) => {
  const { postId } = req.params;

  try {
    await sequelize.models.user_post_likes.create({
      userId: req.userId,
      postId,
    });

    const post = await sequelize.models.post.findByPk(+postId);

    await post.increment("numLikes");

    return res.send();
  } catch (err) {
    console.log(err);

    return res.status(500).send(err);
  }
});

router.delete("/posts/:postId/like", authenticate, async (req, res) => {
  const { postId } = req.params;

  try {
    await sequelize.models.user_post_likes.destroy({
      where: { userId: { [Op.eq]: req.userId } },
    });

    const post = await sequelize.models.post.findByPk(+postId);

    await post.decrement("numLikes");

    return res.send();
  } catch (err) {
    console.log(err);

    return res.status(500).send(err);
  }
});

module.exports = router;
