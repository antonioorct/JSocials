var indexRouter = require("./index");
var usersRouter = require("./users");

module.exports = (app) => {
  app.use("/", indexRouter);
  app.use("/users", usersRouter);
};
