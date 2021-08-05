const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL,
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "winston.log" })],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.prettyPrint()
      ),
    })
  );
}

logger.info("Logger initialized");

module.exports = logger;
