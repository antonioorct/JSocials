const { generateToken } = require("../../middleware/jwt");
const { Router } = require("express");
const router = Router();
const { models } = require("../../sequelize");
const { compare } = require("bcrypt");

router.post("/", async function (req, res) {
  const user = await models.user.findOne({
    where: { username: req.body.username },
  });
  if (!user) return res.status(404).send("Invalid email and/or password");

  let passCompare = await compare(req.body.password, user.password);

  if (!passCompare)
    return res.status(404).send("Invalid email and/or password");

  const token = generateToken(user.id);

  res.send(token);
});

module.exports = router;
