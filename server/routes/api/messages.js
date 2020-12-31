const express = require("express");
const router = express.Router();
const { models } = require("../../sequelize");

router.get("/:id", async function (req, res, next) {
  const messages = await models.message.findAll({
    include: { model: models.chat, where: { id: req.params.id } },
    order: [["created_at", "asc"]],
  });

  res.status(200).send(messages);
});

router.post("/", async function (req, res, next) {
  let newMessage = "";
  try {
    newMessage = await models.message.create(req.body);
  } catch (e) {
    console.log(e);
  }

  res.status(200).send(newMessage);
});

module.exports = router;
