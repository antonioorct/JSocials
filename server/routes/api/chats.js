const express = require("express");
const router = express.Router();
const sequelize = require("../../sequelize");
const { QueryTypes } = require("sequelize");

router.get("/:id", async function (req, res, next) {
  const chats = await sequelize.query(
    ` SELECT  c.id AS "chat.id",
              c.name AS "chat.name",
              u.email AS "user.email",
              m.id AS "message.id",
              m.chat_id AS "message.chatId",
              m.sender_id AS "message.senderId",
              m.body AS "message.body",
              m.created_at AS "message.createdAt"
      FROM chats AS c
      INNER JOIN messages AS m ON c.id = m.chat_id
      INNER JOIN chats_users AS cu ON c.id = cu.chat_id
      INNER JOIN users AS u ON cu.user_id = u.id
      WHERE c.id IN
        ( SELECT chat_id
          FROM chats_users
          WHERE user_id = ?)
        AND m.sender_id = u.id
        AND m.id =
        ( SELECT max(messages.id)
          FROM messages
          WHERE chat_id = c.id)
      ORDER BY m.created_at DESC;`,
    { type: QueryTypes.SELECT, nest: true, replacements: [req.params.id] }
  );

  res.status(200).send(chats);
});

router.post("/", async function (req, res, next) {
  res.status(200).send();
});

module.exports = router;
