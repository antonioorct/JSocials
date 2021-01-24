const express = require("express");
const router = express.Router();
const { models, model } = require("../../sequelize");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { authenticate, authenticateSameUser } = require("../../middleware/jwt");
const { MissingField } = require("../../errors");
const { userExists } = require("../../middleware/userCheck");

router.get("", async function (req, res) {
  const user = await models.user.findAll({
    where: {
      [Op.or]: {
        firstName: { [Op.like]: "%" + req.query.searchTerm + "%" },
        lastName: { [Op.like]: "%" + req.query.searchTerm + "%" },
        username: { [Op.like]: "%" + req.query.searchTerm + "%" },
      },
    },
  });

  if (!user || user.length === 0) res.status(404).send();
  else res.status(200).send(user);
});

router.get("/:userIdentifier", authenticate, async function (req, res) {
  let user;

  if (isNaN(parseInt(req.params.userIdentifier)))
    user = await models.user.findOne({
      where: { username: req.params.userIdentifier },
    });
  else
    user = await models.user.findOne({
      where: { id: req.params.userIdentifier },
    });

  if (!user) res.status(404).send();
  else res.status(200).send(user);
});

router.post("/", async function (req, res, next) {
  const requiredFields = ["username", "password", "email"];

  try {
    const missingFields = requiredFields.filter(
      (field) => !req.body.hasOwnProperty(field)
    );
    if (missingFields.length != 0) throw new MissingField(missingFields);

    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newUser = await models.user.create(req.body);

    res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:userId",
  [authenticateSameUser, userExists],
  async function (req, res, next) {
    try {
      await models.user.update(req.body, {
        where: { id: req.params.userId },
      });
      const updatedUser = await models.user.findByPk(req.params.userId);

      res.status(200).send(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:userId",
  [authenticateSameUser, userExists],
  async function (req, res) {
    await models.user.destroy({ where: { id: req.params.userId } });

    res.status(201).send();
  }
);

module.exports = router;
