const express = require("express");
const { QueryTypes } = require("sequelize");
const sequelize = require("../../sequelize");
const router = express.Router();
const { models } = require("../../sequelize");

router.get("/:id", async function (req, res, next) {
  console.log(req.query.createdAt);
  const messages = await sequelize.query(
    ` SELECT *
      FROM (SELECT *
        FROM messages
        WHERE chat_id = ? 
        ${
          req.query.createdAt
            ? "AND unix_timestamp(created_at) < unix_timestamp(?)"
            : ""
        }
        ORDER BY id DESC
        LIMIT 25) AS t
        inner join chats_users AS cu on cu.chat_id = t.chat_id
        WHERE cu.user_id = ?
        AND unix_timestamp(t.created_at) >= unix_timestamp(cu.created_at)
      ORDER BY id ASC;`,
    {
      type: QueryTypes.SELECT,
      model: models.message,
      mapToModel: true,
      replacements: [
        req.params.id,
        req.query.createdAt || null,
        req.query.userId,
      ],
    }
  );
  const count = await models.message.count({
    include: { model: models.chat, where: { id: req.params.id } },
  });

  res.setHeader("count", count);
  res.status(200).send(messages);
});

router.post("/", async function (req, res, next) {
  try {
    if (!req.body.chatId) {
      const chatCount = await models.chat.count({where: })
      if(chatCount === 1)
    }
    const newMessage = await models.message.create(req.body);
  } catch (e) {
    console.log(e);
  }

  res.status(200).send(newMessage);
});

module.exports = router;
