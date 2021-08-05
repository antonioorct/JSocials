const { Router } = require("express");
const { sequelize, getSequelizeErrorMessage } = require("../database");
const logger = require("../logger");

const router = Router();

router.post("/users", async (req, res) => {
  try {
    await sequelize.models.user.create(req.body);

    res.send();
  } catch (err) {
    logger.error(err);

    const msg = getSequelizeErrorMessage(err);

    return res.status(500).send(msg);
  }
});

module.exports = router;
