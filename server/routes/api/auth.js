const express = require("express");
const router = express.Router();
const { models } = require("../../sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", async function (req, res, next) {
  // const { error } = validateUserAuthentication(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  console.log(req.body);
  let user = await models.user.findOne({ where: { email: req.body.email } });
  if (!user) return res.status(400).send("Invalid email and/or password");

  let passCompare = await bcrypt.compare(req.body.password, user.password);

  if (!passCompare)
    return res.status(400).send("Invalid email and/or password");

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET
  );

  res.send(token);
});

module.exports = router;
