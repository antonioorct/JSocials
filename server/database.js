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
  sequelize.models.post.belongsTo(sequelize.models.user);

  sequelize.models.post.hasMany(sequelize.models.post, {
    as: "comments",
    foreignKey: "postId",
  });

  sequelize.models.post.belongsToMany(sequelize.models.user, {
    through: "user_post_likes",
    as: "likes",
  });
}

async function seedDatabase() {
  if (process.env.NODE_ENV === "production") return;

  await sequelize.models.user.create({
    firstName: "Antonio",
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
  });

  await sequelize.models.post.bulkCreate([
    {
      content: "First",
      userId: 1,
      private: false,
    },
    {
      content: "Second",
      attachment: "uploads/Focal-Fossa_WP_1920x1080_1628183702963.png",
      userId: 1,
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
}

async function init() {
  try {
    initModels();
    initAssociations();

    await sequelize.sync({ alter: true });

    // seedDatabase();

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
