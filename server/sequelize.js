const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:3306/${process.env.DB_DB}`
  // { logging: false }
);

try {
  console.log("Connected to database.");
} catch (error) {
  console.log("Unable to connect to the database:");
  console.log(error.message);
  process.exit(1);
}

const models = [
  require("./models/user.model"),
  require("./models/post.model"),
  require("./models/message.model"),
  require("./models/chat.model"),
  require("./models/chatUser.model"),
  require("./models/userPostLike.model"),
];

models.forEach((model) => {
  model(sequelize);
});

module.exports = sequelize;
