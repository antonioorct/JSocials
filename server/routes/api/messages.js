const express = require("express");
const { QueryTypes } = require("sequelize");
const sequelize = require("../../sequelize");
const router = express.Router();
const { models } = require("../../sequelize");

router.get("/:id", async function (req, res, next) {
  const messages = await sequelize.query(
    ` SELECT *
      FROM (SELECT *
        FROM messages
        WHERE chat_id = ? 
        AND unix_timestamp(created_at) < unix_timestamp(?)
        ORDER BY id DESC
        LIMIT 25) AS t
      ORDER BY id asc;`,
    {
      type: QueryTypes.SELECT,
      model: models.message,
      mapToModel: true,
      replacements: [req.params.id, req.header("createdAt")],
    }
  );
  const count = await models.message.count({
    include: { model: models.chat, where: { id: req.params.id } },
  });

  res.setHeader("count", count);
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
