const { Router } = require("express");
const { Op } = require("sequelize");
const {
  sequelize,
  getSequelizeErrorMessage,
  caseInsensitiveWhere,
} = require("../database");
const { authenticate } = require("../utils/jwt");
const logger = require("../logger");
const { POST_OPTIONS } = require("./posts");
const { attachment } = require("../utils/fileStorage");
const { removeFile, getFilePath } = require("../utils/files");
const { hashPassword } = require("../utils/hash");

const router = Router();

const PROFILE_OPTIONS = (userId) => ({
  order: [
    [sequelize.models.post, "createdAt", "DESC"],
    [
      sequelize.models.post,
      { model: sequelize.models.post, as: "comments" },
      "createdAt",
      "DESC",
    ],
  ],
  include: [
    {
      model: sequelize.models.userDetails,
      as: "userDetails",
      attributes: { exclude: ["id", "userId", "createdAt", "updatedAt"] },
    },
    {
      model: sequelize.models.post,
      ...POST_OPTIONS,
      required: false,
      where: {
        postId: null,
        [Op.or]: {
          userId,
          private: false,
        },
      },
    },
    { model: sequelize.models.user, as: "friends" },
  ],
});

router.get("/users", authenticate, async (req, res) => {
  try {
    const { query } = req.query;

    const user = await sequelize.models.user.findAll({
      where: {
        [Op.or]: [
          caseInsensitiveWhere("firstName", query),
          caseInsensitiveWhere("lastName", query),
          caseInsensitiveWhere("username", query),
        ],
      },
    });

    return res.send(user);
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.get("/users/credentials", authenticate, async (req, res) => {
  try {
    const { userId } = req;

    const user = await sequelize.models.user.findByPk(+userId);

    return res.send(user);
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.put("/users/credentials", authenticate, async (req, res) => {
  try {
    const { userId } = req;

    if (req.body.password)
      req.body.password = await hashPassword(req.body.password);

    await sequelize.models.user.update(req.body, { where: { id: userId } });

    return res.send();
  } catch (err) {
    logger.error(err);

    const msg = getSequelizeErrorMessage(err);

    return res.status(500).send(msg);
  }
});

router.get("/profile/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    const userProfile = await sequelize.models.user.findByPk(
      +userId,
      PROFILE_OPTIONS(req.userId)
    );

    return res.send(userProfile);
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.post("/users", async (req, res) => {
  try {
    req.body.password = await hashPassword(req.body.password);

    const newUser = await sequelize.models.user.create(req.body);
    await sequelize.models.userDetails.create({
      userId: newUser.getDataValue("id"),
    });

    return res.send();
  } catch (err) {
    logger.error(err);

    const msg = getSequelizeErrorMessage(err);

    return res.status(500).send(msg);
  }
});

router.put("/users/photo", [authenticate, attachment], async (req, res) => {
  try {
    const { userId } = req;

    const user = await sequelize.models.user.findByPk(userId);

    const userImage = user.getDataValue("image");
    if (userImage) removeFile(userImage);

    await sequelize.models.user.update(
      {
        image: getFilePath(req.file.filename),
      },
      { where: { id: userId } }
    );

    await user.reload();

    return res.send(user);
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.delete("/users/photo", authenticate, async (req, res) => {
  try {
    const { userId } = req;

    const user = await sequelize.models.user.findByPk(userId);

    removeFile(user.getDataValue("image"));

    await user.update(
      {
        image: null,
      },
      { fields: ["image"] }
    );

    return res.send();
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

router.put("/users", authenticate, async (req, res) => {
  try {
    const { userId } = req;

    await sequelize.models.userDetails.update(req.body, {
      where: { userId },
    });

    return res.send();
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err);
  }
});

module.exports = router;
