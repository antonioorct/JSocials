const { MissingField } = require("../../errors");
const {
  userExists,
  chatExists,
  messageExists,
} = require("../../middleware/userCheck");
const { authenticate, authenticateSameUser } = require("../../middleware/jwt");
const express = require("express");
const router = express.Router();
const { QueryTypes } = require("sequelize");

const sequelize = require("../../sequelize");
const { models } = require("../../sequelize");

router.get(
  "/users/:userId/chats",
  [authenticateSameUser, userExists],
  async function (req, res) {
    try {
      const chats = await sequelize.query(
        ` SELECT c.id AS "chat.id",
            c.name AS "chat.name",
            u.first_name AS "user.firstName",
            u.last_name AS "user.lastName",
            m.id AS "message.id",
            m.body AS "message.body",
            m.created_at AS "message.createdAt",
            u.first_name AS "message.user.firstName",
            u.last_name AS "message.user.lastName"
          FROM chats AS c
            INNER JOIN messages AS m ON c.id = m.chat_id
            INNER JOIN chats_users AS cu ON c.id = cu.chat_id
            INNER JOIN users AS u ON cu.user_id = u.id
          WHERE c.id IN
            ( SELECT chat_id
              FROM chats_users
              WHERE user_id = ?
                AND unix_timestamp(m.created_at) >= unix_timestamp(chats_users.updated_at))
            AND u.id <> ?
            AND m.id =
              ( SELECT max(messages.id)
                FROM messages
                WHERE chat_id = c.id)
           ORDER BY m.created_at DESC;`,
        {
          type: QueryTypes.SELECT,
          nest: true,
          replacements: [req.params.userId, req.params.userId],
        }
      );
      /* if (chats.chat.name !== "") {
        const users = await sequelize.query(
          ` SELECT
              u.first_name AS "users.firstName",
              u.last_name AS "users.lastName"
            FROM users AS u
              INNER JOIN chats_users AS cu ON u.id = cu.user_id
              INNER JOIN chats AS c ON c.id = cu.chat_id
            WHERE c.id = ?;`,
          {
            type: QueryTypes.SELECT,
            nest: true,
            replacements: [req.params.chatId],
          }
        );
      } */

      res.status(200).send(chats);
    } catch (err) {
      console.log(err);
      res.send(500).send();
    }
  }
);

router.get(
  "/chats/:chatId/messages",
  [authenticate, chatExists],
  async function (req, res) {
    try {
      const isInChat = await models.chatUser.findOne({
        where: { userId: req.userId, chatId: req.params.chatId },
      });
      if (!isInChat) return res.status(403).send("Access denied.");

      const messages = await sequelize.query(
        ` SELECT *
          FROM (  SELECT
                    m.*,
                    u.first_name AS "user.firstName",
                    u.last_name AS "user.lastName"
                  FROM messages AS m INNER JOIN
                    chats_users AS cu ON cu.user_id = ? INNER JOIN
                    users AS u ON u.id = m.sender_id
                  WHERE m.chat_id = ? 
                    AND unix_timestamp(m.created_at) < unix_timestamp(?)
                    AND unix_timestamp(m.created_at) >= unix_timestamp(cu.updated_at)
                  ORDER BY m.id DESC
                  LIMIT 25) AS t
          ORDER BY t.id ASC;`,
        {
          type: QueryTypes.SELECT,
          nest: true,
          replacements: [req.userId, req.params.chatId, req.query.createdAt],
        }
      );

      res.status(200).send(messages);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }
);

router.post(
  "/chats/:chatId",
  [authenticate, chatExists],
  async function (req, res, next) {
    try {
      const isInChat = await models.chatUser.findOne({
        where: { userId: req.userId, chatId: req.params.chatId },
      });
      if (!isInChat) return res.status(403).send("Access denied.");

      if (!req.body.body) throw new MissingField(["body"]);

      const newMessage = await models.message.create({
        body: req.body.body,
        senderId: req.userId,
        chatId: req.params.chatId,
      });

      res.status(201).send(newMessage);
    } catch (err) {
      next(err);
    }
  }
);

//body: incomingUserId
router.post("/chats", authenticate, async function (req, res, next) {
  try {
    let chatId = await sequelize.query(
      `SELECT 
    IF(COUNT(*) = 2, chat_id, 0) AS "chatId"
FROM
    zavrsni_dev.chats_users
WHERE
    chat_id IN (SELECT 
            chat_id
        FROM
            chats_users
        WHERE
            user_id = ? OR user_id = ?
        GROUP BY chat_id
        HAVING COUNT(*) > 1)
GROUP BY chat_id;`,
      {
        plain: true,
        raw: true,
        replacements: [req.userId, req.body.incomingUserId],
      }
    );

    let newMessage;
    if (!chatId) {
      chatId = (await models.chat.create({ name: "" })).getDataValue("id");

      await models.chatUser.create({
        chatId,
        userId: req.userId,
      });
      await models.chatUser.create({
        chatId,
        userId: req.body.incomingUserId,
      });
    } else chatId = chatId.chatId;

    newMessage = await models.message.create({
      chatId,
      senderId: req.userId,
      body: req.body.body,
    });

    res.status(200).send(newMessage);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.delete(
  "/messages/:messageId",
  [authenticate, messageExists],
  async function (req, res, next) {
    try {
      const isInChat = (
        await sequelize.query(
          `
    SELECT  EXISTS( SELECT 
              *
          FROM
              chats_users
          WHERE
              chat_id = (SELECT 
                      chat_id
                  FROM
                      messages m
                          INNER JOIN
                      chats c ON m.chat_id = c.id
                  WHERE
                      m.id = ?
                    AND
                      m.sender_id = ?)
                  AND user_id = ?) AS isInChat;
      `,
          {
            plain: true,
            raw: true,
            replacements: [req.params.messageId, req.userId, req.userId],
          }
        )
      ).isInChat;
      if (!isInChat) return res.status(403).send("Access denied.");

      await models.message.destroy({ where: { id: req.params.messageId } });

      res.status(204).send();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

router.delete(
  "/chats/:chatId",
  [authenticate, chatExists],
  async function (req, res, next) {
    try {
      const isInChat = await models.chatUser.findOne({
        where: { userId: req.userId, chatId: req.params.chatId },
      });
      if (!isInChat) return res.status(403).send("Access denied.");

      await models.chatUser.update(
        { userId: req.userId, chatId: req.params.chatId },
        {
          where: { userId: req.userId, chatId: req.params.chatId },
        }
      );

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
