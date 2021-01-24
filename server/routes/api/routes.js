var indexRouter = require("./index");
var usersRouter = require("./users");
var authRouter = require("./auth");
var postRouter = require("./posts");
var messageRouter = require("./messages");
var chatRouter = require("./chats");
var friendsRouter = require("./friends");

module.exports = (app) => {
  app.use("/", indexRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/messages", messageRouter);
  app.use("/api/", chatRouter);
  app.use("/api", friendsRouter);
};
