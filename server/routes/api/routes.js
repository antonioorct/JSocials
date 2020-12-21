var indexRouter = require("./index");
var usersRouter = require("./users");
var authRouter = require("./auth");
var postRouter = require("./posts");

module.exports = (app) => {
  app.use("/", indexRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/posts", postRouter);
};
