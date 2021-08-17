const { transports, format, createLogger } = require("winston");

const logger = createLogger({
  level: process.env.LOGGER_LEVEL,
  format: format.simple(),
  transports: [new transports.File({ filename: "winston.log" })],
});

logger.error = (err) => {
  if (err instanceof Error)
    logger.log({ level: "error", message: `${err.stack || err}` });
  else logger.log({ level: "error", message: err });
};

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

logger.info("Logger initialized");

module.exports = logger;
