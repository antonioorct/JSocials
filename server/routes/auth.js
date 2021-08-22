const { Router } = require("express");
const { sequelize } = require("../database");
const logger = require("../logger");
const jwt = require("../utils/jwt");
const { checkPasswords } = require("../utils/hash");

const router = Router();

router.post("/auth", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await sequelize.models.user.findOne({
      where: { username },
      attributes: { include: "password" },
    });

    if (!user) return res.status(400).send("Invalid email and/or password.");

    if (!(await checkPasswords(password, user.password)))
      return res.status(400).send("Invalid email and/or password.");

    const token = jwt.generateToken(user.id);

    res.status(200).send(token);
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err.message);
  }
});

module.exports = router;
