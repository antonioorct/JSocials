const { Router } = require("express");
const { Op } = require("sequelize");
const { sequelize } = require("../database");
const logger = require("../logger");
const { attachment } = require("../utils/fileStorage");
const { authenticate } = require("../utils/jwt");
const fs = require("fs");
const path = require("path");

const router = Router();

const POST_OPTIONS = {
  order: [
    ["createdAt", "DESC"],
    [{ model: sequelize.models.post, as: "comments" }, "createdAt", "DESC"],
  ],
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
};

const COMMENT_OPTIONS = {
  include: [
    sequelize.models.user,
    {
      model: sequelize.models.user,
      through: sequelize.models.user_post_likes,
      as: "likes",
    },
  ],
};

router.get("/posts", authenticate, async (req, res) => {
  const posts = await sequelize.models.post.findAll({
    ...POST_OPTIONS,
    where: {
      postId: { [Op.eq]: null },
    },
  });

  return res.send(posts);
});

router.post("/posts", [authenticate, attachment], async (req, res) => {
  try {
    const newPost = await sequelize.models.post.create({
      ...req.body,
      attachment: req.file
        ? `${process.env.ASSETS_SAVE_LOCATION}/${req.file.filename}`
        : undefined,
      userId: req.userId,
    });

    const post = await sequelize.models.post.findByPk(newPost.id, POST_OPTIONS);

    return res.send(post);
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

    const comment = await sequelize.models.post.findByPk(
      newComment.id,
      COMMENT_OPTIONS
    );

    return res.send(comment);
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.delete("/posts/:postId", authenticate, async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await sequelize.models.post.findByPk(+postId);

    if (post.attachment) {
      const filePath = path.join(__dirname, "..", post.attachment);

      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed in deleting file: " + post.attachment);
      }
    }

    post.destroy();

    return res.send();
  } catch (err) {
    console.log(err);

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

    const post = await sequelize.models.post.findByPk(+postId, POST_OPTIONS);

    await post.increment("numLikes");

    await post.reload(POST_OPTIONS);

    return res.send(post);
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

    const post = await sequelize.models.post.findByPk(+postId, POST_OPTIONS);

    await post.decrement("numLikes");

    await post.reload(POST_OPTIONS);

    return res.send(post);
  } catch (err) {
    console.log(err);

    return res.status(500).send(err);
  }
});

module.exports = router;