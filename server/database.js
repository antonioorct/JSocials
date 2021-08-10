const { Sequelize, ValidationError } = require("sequelize");
const logger = require("./logger");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const BCRYPT_SALT_ROUNDS = 10;

const MODELS_FOLDER = "models";

const RETRY_TIMEOUT = 5000;
let retryCounter = 0;

const sequelize = new Sequelize(
  `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_SERVICE_NAME}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DATABASE}`
);

function initModels() {
  const models = [];
  const normalizedPath = path.join(__dirname, MODELS_FOLDER);

  fs.readdirSync(normalizedPath).forEach((file) =>
    models.push(require(`./${MODELS_FOLDER}/` + file))
  );

  models.forEach((model) => model.init(sequelize));
}

function initAssociations() {
  sequelize.models.user.hasOne(sequelize.models.userDetails, {
    foreignKey: "userId",
    as: "userDetails",
  });

  sequelize.models.user.hasMany(sequelize.models.post);
  sequelize.models.post.belongsTo(sequelize.models.user);

  sequelize.models.post.hasMany(sequelize.models.post, {
    as: "comments",
    foreignKey: "postId",
  });

  sequelize.models.post.belongsToMany(sequelize.models.user, {
    through: "user_post_likes",
    as: "likes",
  });

  sequelize.models.chat.belongsToMany(sequelize.models.user, {
    through: "chat_user",
    as: "users",
  });

  sequelize.models.message.belongsTo(sequelize.models.user);
  sequelize.models.chat.hasMany(sequelize.models.message);

  sequelize.models.user.belongsToMany(sequelize.models.user, {
    as: "friends",
    through: "friend",
  });

  sequelize.models.user.belongsToMany(sequelize.models.user, {
    as: "outgoing_users",
    foreignKey: "incoming_user_id",
    through: "friend_request",
  });

  sequelize.models.user.belongsToMany(sequelize.models.user, {
    as: "incoming_users",
    foreignKey: "outgoing_user_id",
    through: "friend_request",
  });
}

async function seedDatabase() {
  if (process.env.NODE_ENV === "production") return;

  const isDatabaseSeeded = await sequelize.models.user.findByPk(1);
  if (isDatabaseSeeded) return;

  await sequelize.models.user.bulkCreate([
    {
      firstName: "Prvi",
      lastName: "Orct",
      username: "a",
      email: "antonio.orct@hotmail.com",
      image: "/logo512.png",
      password: await bcrypt.hash("a", BCRYPT_SALT_ROUNDS),
      bio: "This is all about me",
      details: {
        gender: "Male",
        relationshipStatus: "Single",
        website: "www.website.com",
      },
    },
    {
      firstName: "Drugi",
      lastName: "Antic",
      username: "b",
      email: "bntonio.orct@hotmail.com",
      image: "/logo512.png",
      password: await bcrypt.hash("a", BCRYPT_SALT_ROUNDS),
      bio: "This is all about me",
      details: {
        gender: "Male",
        relationshipStatus: "Single",
        website: "www.website.com",
      },
    },
    {
      firstName: "Treci",
      lastName: "Horvat",
      username: "c",
      email: "cntonio.orct@hotmail.com",
      image: "/logo512.png",
      password: await bcrypt.hash("a", BCRYPT_SALT_ROUNDS),
      bio: "This is all about me",
      details: {
        gender: "Male",
        relationshipStatus: "Single",
        website: "www.website.com",
      },
    },
    {
      firstName: "Cetvrti",
      lastName: "Peric",
      username: "d",
      email: "dntonio.orct@hotmail.com",
      image: "/logo512.png",
      password: await bcrypt.hash("a", BCRYPT_SALT_ROUNDS),
      bio: "This is all about me",
    },
  ]);

  await sequelize.models.userDetails.bulkCreate([
    {
      userId: 1,
      gender: "Male",
      relationshipStatus: "Single",
      website: "www.website.com",
    },
  ]);

  await sequelize.models.post.bulkCreate([
    {
      content: "First",
      userId: 1,
      private: false,
    },
    {
      content: "Second",
      attachment: "uploads/Focal-Fossa_WP_1920x1080_1628183702963.png",
      userId: 2,
      private: false,
    },
    {
      content: "Third with comments",
      userId: 1,
      private: false,
    },
    {
      content: "First comment",
      userId: 1,
      private: false,
      postId: 3,
    },
  ]);

  await sequelize.models.chat.bulkCreate([
    {
      id: 1,
    },
    { id: 2, name: "First name" },
    {
      id: 3,
    },
    {
      id: 4,
    },
  ]);

  await sequelize.models.chat_user.bulkCreate([
    { chatId: 1, userId: 1 },
    { chatId: 1, userId: 2 },
    { chatId: 2, userId: 1 },
    { chatId: 2, userId: 3 },
    { chatId: 3, userId: 2 },
    { chatId: 3, userId: 3 },
    { chatId: 4, userId: 1 },
    { chatId: 4, userId: 4 },
  ]);

  await sequelize.models.message.bulkCreate([
    { chatId: 1, userId: 1, content: "First" },
    { chatId: 1, userId: 1, content: "Second" },
    { chatId: 1, userId: 2, content: "Third" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 1, userId: 1, content: "Fourth" },
    { chatId: 2, userId: 1, content: "First" },
    { chatId: 3, userId: 2, content: "First" },
    { chatId: 4, userId: 1, content: "First" },
  ]);

  await sequelize.models.friend.bulkCreate([
    {
      userId: 1,
      friendId: 2,
    },
    {
      userId: 2,
      friendId: 1,
    },
    {
      userId: 3,
      friendId: 1,
    },
    {
      userId: 1,
      friendId: 3,
    },
    {
      userId: 2,
      friendId: 3,
    },
    {
      userId: 3,
      friendId: 2,
    },
  ]);

  await sequelize.models.friend_request.bulkCreate([
    {
      incoming_user_id: 1,
      outgoing_user_id: 2,
    },

    {
      incoming_user_id: 3,
      outgoing_user_id: 1,
    },
  ]);
}

async function init() {
  try {
    initModels();
    initAssociations();

    await sequelize.sync({ alter: true });

    seedDatabase();

    logger.info("Database initialized");
  } catch (err) {
    if (retryCounter < 5) {
      logger.error("Error initializing the database: ", err);
      logger.error(`Retrying in ${RETRY_TIMEOUT / 1000} seconds`);

      retryCounter++;

      setTimeout(init, RETRY_TIMEOUT);
    } else throw new Error("Could not initialize database: ", err);
  }
}

function getSequelizeErrorMessage(err) {
  let msg = "";
  if (err instanceof ValidationError) {
    err.errors.forEach((error) => {
      switch (error.validatorKey) {
        case "not_unique":
          msg = `${error.path} is already taken.`;
          break;
        case "is_null":
          msg = `Missing required fields: ${error.path}`;
          break;
        default:
          msg = "Unknown database error occurred.";
      }
    });
  } else return err;

  return msg;
}

module.exports = { sequelize, init, getSequelizeErrorMessage };
