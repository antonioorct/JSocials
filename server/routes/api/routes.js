var authRouter = require("./auth");
var usersRouter = require("./users");
var friendsRouter = require("./friends");
var friendRequestsRouter = require("./friendRequests");
var postsRouter = require("./posts");
var commentsRouter = require("./comments");
var likesRouter = require("./likes");
var chatsRouter = require("./chats");
var messagesRouter = require("./messages");

module.exports = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api", friendsRouter);
  app.use("/api", friendRequestsRouter);
  app.use("/api", postsRouter);
  app.use("/api", commentsRouter);
  app.use("/api", likesRouter);
  app.use("/api/", chatsRouter);
  app.use("/api/messages", messagesRouter);
};
