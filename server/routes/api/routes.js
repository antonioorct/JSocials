var indexRouter = require("./index");
var usersRouter = require("./users");
var authRouter = require("./auth");
var postsRouter = require("./posts");
var messagesRouter = require("./messages");
var chatsRouter = require("./chats");
var friendsRouter = require("./friends");
var friendRequestsRouter = require("./friendRequests");

module.exports = (app) => {
  app.use("/", indexRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/auth", authRouter);
  app.use("/api", postsRouter);
  app.use("/api/messages", messagesRouter);
  app.use("/api/", chatsRouter);
  app.use("/api", friendsRouter);
  app.use("/api", friendRequestsRouter);
};
