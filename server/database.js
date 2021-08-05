const { Sequelize, ValidationError } = require("sequelize");
const logger = require("./logger");
const path = require("path");
const fs = require("fs");

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

async function init() {
  try {
    initModels();

    await sequelize.sync({ alter: true });

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
