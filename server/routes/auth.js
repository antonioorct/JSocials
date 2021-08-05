const { Router } = require("express");
const { sequelize } = require("../database");
const bcrypt = require("bcrypt");
const logger = require("../logger");
const jwt = require("../utils/jwt");

const router = Router();

router.post("/auth", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await sequelize.models.user.findOne({
      where: { username },
    });

    if (!user) return res.status(400).send("Invalid email and/or password.");

    let passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch)
      return res.status(400).send("Invalid email and/or password.");

    const token = jwt.generateToken(user.id);

    res.status(200).send(token);
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err.message);
  }
});

module.exports = router;
