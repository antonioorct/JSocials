const { Sequelize } = require("sequelize");
const logger = require("./logger");

const RETRY_TIMEOUT = 5000;

const sequelize = new Sequelize(
  `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_SERVICE_NAME}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DATABASE}`
);

let retryCounter = 0;

async function init() {
  try {
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

module.exports = { init };
