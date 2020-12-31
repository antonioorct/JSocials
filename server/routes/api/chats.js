const express = require("express");
const router = express.Router();
const sequelize = require("../../sequelize");
const { QueryTypes } = require("sequelize");

router.get("/:id", async function (req, res, next) {
  const chats = await sequelize.query(
    ` SELECT  c.id,
              c.name,
              u.email,
              m.body,
              m.created_at createdAt
      FROM chats AS c
      INNER JOIN messages AS m ON c.id = m.chat_id
      INNER JOIN chats_users AS cu ON c.id = cu.chat_id
      INNER JOIN users AS u ON cu.user_id = u.id
      WHERE c.id IN
        ( SELECT chat_id
          FROM chats_users
          WHERE user_id = ${req.params.id})
        AND m.sender_id = u.id
        AND m.created_at =
        ( SELECT max(created_at)
          FROM messages
          WHERE chat_id = c.id)
      ORDER BY m.created_at DESC;`,
    { type: QueryTypes.SELECT }
  );

  res.status(200).send(chats);
});

router.post("/", async function (req, res, next) {
  res.status(200).send();
});

module.exports = router;
