const { Router } = require("express");
const { sequelize, getSequelizeErrorMessage } = require("../database");
const logger = require("../logger");
const bcrypt = require("bcrypt");
const BCRYPT_SALT_ROUNDS = 10;

const router = Router();

router.post("/users", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(
      req.body.password,
      BCRYPT_SALT_ROUNDS
    );

    await sequelize.models.user.create(req.body);

    res.send();
  } catch (err) {
    logger.error(err);

    const msg = getSequelizeErrorMessage(err);

    return res.status(500).send(msg);
  }
});

module.exports = router;
