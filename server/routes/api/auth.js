const { generateToken, authenticateSameUser } = require("../../middleware/jwt");
const { Router } = require("express");
const router = Router();
const { models } = require("../../sequelize");
const { compare } = require("bcrypt");
const { NotFound, MissingField } = require("../../errors");

router.post("/auth", async function (req, res, next) {
  const requiredFields = ["username", "password"];

  try {
    const missingFields = requiredFields.filter(
      (field) => !req.body.hasOwnProperty(field)
    );
    if (missingFields.length !== 0) throw new MissingField(missingFields);

    const user = await models.user.findOne({
      where: { username: req.body.username },
    });
    if (!user) throw new NotFound("Invalid email and/or password.");

    let passCompare = await compare(req.body.password, user.password);

    if (!passCompare) throw new NotFound("Invalid email and/or password.");

    const token = generateToken(user.id);

    res.status(200).send(token);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/auth/:userId/jwt",
  authenticateSameUser,
  async function (req, res, next) {
    try {
      const token = generateToken(req.userId);

      res.status(200).send(token);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
