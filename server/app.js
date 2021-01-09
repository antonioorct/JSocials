require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const sequelize = require("./sequelize");
const router = require("./routes/api/routes");
const cors = require("cors");
const { models } = require("./sequelize");
const io = require("socket.io")();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    exposedHeaders: ["*"],
  })
);

router(app);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
});

sequelize.models.user.belongsToMany(sequelize.models.chat, {
  through: {
    model: sequelize.models.chatUser,
  },
});

sequelize.models.chat.belongsToMany(sequelize.models.user, {
  through: {
    model: sequelize.models.chatUser,
  },
});

sequelize.models.chat.hasMany(sequelize.models.message);
sequelize.models.chat.hasMany(sequelize.models.chatUser);
sequelize.models.message.belongsTo(sequelize.models.chat);

sequelize.models.post.hasMany(sequelize.models.post, { as: "comments" });
sequelize.models.post.belongsTo(sequelize.models.user);

sequelize.models.post.belongsToMany(sequelize.models.user, {
  through: { model: models.userPostLike },
});
sequelize.models.post.hasMany(sequelize.models.userPostLike);
sequelize.models.userPostLike.belongsTo(sequelize.models.user);

sequelize.models.user.belongsToMany(sequelize.models.user, {
  through: sequelize.models.friend,
  foreignKey: "user1_id",
  otherKey: "user2_id",
  as: "friends",
});
sequelize.models.friend.belongsTo(sequelize.models.user, {
  foreignKey: "user2_id",
});

sequelize.models.user.hasMany(sequelize.models.pendingFriend, {
  foreignKey: "userOutgoingId",
  as: "outgoing",
});
sequelize.models.user.hasMany(sequelize.models.pendingFriend, {
  foreignKey: "userIncomingId",
  as: "incoming",
});

sequelize.models.pendingFriend.belongsTo(sequelize.models.user, {
  foreignKey: "userOutgoingId",
  as: "userOutgoing",
});
sequelize.models.pendingFriend.belongsTo(sequelize.models.user, {
  foreignKey: "userIncomingId",
  as: "userIncoming",
});
sequelize.models.pendingFriend.removeAttribute("id");
sequelize.models.friend.removeAttribute("id");
sequelize.models.friend.removeAttribute("user1_id");
sequelize.models.friend.removeAttribute("user2_id");
sequelize.models.user.removeAttribute("user_id");

module.exports = app;
