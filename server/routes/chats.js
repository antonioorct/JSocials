const { Router } = require("express");
const { sequelize } = require("../database");
const logger = require("../logger");
const { io } = require("../socket");
const { authenticate } = require("../utils/jwt");

const router = Router();

const CHAT_OPTIONS = {
  include: [
    {
      model: sequelize.models.user,
      through: "chat_user",
      as: "users",
    },
    {
      model: sequelize.models.message,
      include: sequelize.models.user,
    },
  ],
  order: [[sequelize.models.message, "createdAt", "DESC"]],
};

const MESSAGE_OPTIONS = {
  include: sequelize.models.user,
};

router.get("/chats", authenticate, async (req, res) => {
  try {
    let chats = await sequelize.models.chat.findAll(CHAT_OPTIONS);

    chats = getChatsForUser(chats, req.userId);

    chats = sortChats(chats);

    return res.send(chats);
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err.message);
  }
});

router.post("/chats", authenticate, async (req, res) => {
  try {
    const { content, userId } = req.body;

    const newChat = await sequelize.models.chat.create();
    await sequelize.models.chat_user.bulkCreate([
      {
        chatId: newChat.getDataValue("id"),
        userId: req.userId,
      },
      {
        chatId: newChat.getDataValue("id"),
        userId,
      },
    ]);

    const message = await sequelize.models.message.create({
      userId: req.userId,
      chatId: newChat.getDataValue("id"),
      content,
    });

    const newMessage = await sequelize.models.message.findByPk(
      message.id,
      MESSAGE_OPTIONS
    );

    const chat = await sequelize.models.chat.findByPk(
      message.chatId,
      CHAT_OPTIONS
    );

    const userIndex = chat
      .getDataValue("users")
      .findIndex((user) => user.getDataValue("id") === +req.userId);
    chat.getDataValue("users").splice(userIndex, 1);

    const recepientId = chat
      .getDataValue("users")
      .find((user) => user.getDataValue("id") !== +req.userId)
      .getDataValue("id");
    io().to(recepientId).emit("message", newMessage);

    return res.send(chat);
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err.message);
  }
});

router.post("/chats/:chatId", authenticate, async (req, res) => {
  const { chatId } = req.params;

  try {
    const { content } = req.body;

    const message = await sequelize.models.message.create({
      userId: req.userId,
      chatId,
      content,
    });

    const newMessage = await sequelize.models.message.findByPk(
      message.id,
      MESSAGE_OPTIONS
    );

    const chat = await sequelize.models.chat.findByPk(
      message.chatId,
      CHAT_OPTIONS
    );

    const recepientId = chat
      .getDataValue("users")
      .find((user) => user.getDataValue("id") !== +req.userId)
      .getDataValue("id");
    io().to(recepientId.toString()).emit("message", newMessage);

    return res.send(newMessage);
  } catch (err) {
    logger.error(err);

    return res.status(500).send(err.message);
  }
});

function getChatsForUser(chats, userId) {
  return chats.filter((chat) => {
    const users = chat.getDataValue("users");

    const userIndex = users.findIndex(
      (user) => user.getDataValue("id") === +userId
    );

    if (userIndex !== -1) {
      users.splice(userIndex, 1);

      return true;
    }
    return false;
  });
}

function sortChats(chats) {
  return chats.sort((first, second) => {
    const firstMessage =
      first.getDataValue("messages")[first.getDataValue("messages").length - 1];
    const secondMessage =
      second.getDataValue("messages")[
        second.getDataValue("messages").length - 1
      ];

    return (
      new Date(secondMessage.getDataValue("createdAt")).getTime() -
      new Date(firstMessage.getDataValue("createdAt").getTime())
    );
  });
}

module.exports = router;
