const express = require("express");
const router = express.Router();
const sequelize = require("../../sequelize");
const { QueryTypes } = require("sequelize");
const { models } = require("../../sequelize");
const { Op } = require("sequelize");

router.get("/:id", async function (req, res, next) {
  const chats = await sequelize.query(
    ` SELECT  c.id AS "chat.id",
              c.name AS "chat.name",
              u.first_name AS "user.firstName",
              u.last_name AS "user.lastName",
              u.id AS "user.id",
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
        AND m.sender_id <> u.id
        AND m.id =
        ( SELECT max(messages.id)
          FROM messages
          WHERE chat_id = c.id)
      ORDER BY m.created_at DESC
      ${req.query.limit ? "LIMIT " + req.query.limit : ""};`,
    { type: QueryTypes.SELECT, nest: true, replacements: [req.params.id] }
  );

  res.status(200).send(chats);
});

router.post("/", async function (req, res) {
  const newChat = await models.chat.create({ name: "" });

  await models.chatUser.create({
    chatId: newChat.id,
    userId: req.body.userIncomingId,
  });
  await models.chatUser.create({
    chatId: newChat.id,
    userId: req.body.userOutgoingId,
  });

  res.status(200).send(newChat);
});

module.exports = router;
