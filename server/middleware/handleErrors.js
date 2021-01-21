const { ValidationError } = require("sequelize");
const { GeneralError, MissingField } = require("../errors");

const handleErrors = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    err.errors.forEach((error) => {
      console.log(error);
      switch (error.validatorKey) {
        case "not_unique":
          const duplicateKey = error.path.split(".")[1].replace("_UNIQUE", "");
          const duplicateValue = error.value;

          return res.status(400).json({
            status: 400,
            title: `UNIQUE_CONSTRAINT_ERROR`,
            detail:
              "That " + duplicateKey + " is taken. Please choose another one",
          });
        case "is_null":
          const nullKey = error.path;

          return res.status(400).json({
            status: 400,
            title: "NULL_FIELD_ERROR",
            detail: "Missing required fields: " + nullKey,
            invalidParams: [nullKey],
          });
      }
    });
  } else if (err instanceof MissingField) {
    return res.status(400).json({
      status: 400,
      title: err.title,
      detail: err.detail,
      invalidParams: err.invalidParams,
    });
  } else if (err instanceof GeneralError)
    return res.status(err.getCode()).json({
      status: err.getCode(),
      title: err.title,
      detail: err.detail,
    });
  else
    return res.status(500).json({
      status: "500",
      message: err.message,
    });
};

module.exports = handleErrors;
