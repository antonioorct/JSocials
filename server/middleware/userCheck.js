const { models } = require("../sequelize");

async function userExists(req, res, next) {
  let userId = req.params.userId;

  try {
    if (!userId) return res.status(400).send();

    const user = await models.user.findByPk(userId);

    if (!user)
      return res.status(404).json({
        status: 404,
        title: "User not found",
        detail: "User not found",
      });

    next();
  } catch (err) {
    return res.sendStatus(500);
  }
}

async function chatExists(req, res, next) {
  let chatId = req.params.chatId;

  try {
    if (!chatId) return res.status(400).send();

    const chat = await models.chat.findByPk(chatId);

    if (!chat)
      return res.status(404).json({
        status: 404,
        title: "Chat not found",
        detail: "Chat not found",
      });

    next();
  } catch (err) {
    return res.sendStatus(500);
  }
}

async function messageExists(req, res, next) {
  let messageId = req.params.messageId;

  try {
    if (!messageId) return res.status(400).send();

    const message = await models.message.findByPk(messageId);

    if (!message)
      return res.status(404).json({
        status: 404,
        title: "Message not found",
        detail: "Message not found",
      });

    next();
  } catch (err) {
    return res.sendStatus(500);
  }
}

async function postExists(req, res, next) {
  let postId = req.params.postId;

  try {
    if (!postId) return res.status(400).send();

    const post = await models.post.findByPk(postId);

    if (!post)
      return res.status(404).json({
        status: 404,
        title: "Post not found",
        detail: "Post not found",
      });

    next();
  } catch (err) {
    return res.sendStatus(500);
  }
}
module.exports = { userExists, chatExists, messageExists, postExists };
