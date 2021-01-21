class GeneralError extends Error {
  constructor(title, detail) {
    super();
    this.title = title;
    this.detail = detail;
  }

  getCode() {
    if (this instanceof BadRequest || this instanceof MissingField) return 400;
    if (this instanceof NotFound) return 404;
    return 500;
  }
}

class MissingField extends GeneralError {
  constructor(fields) {
    super();
    this.title = "NULL_FIELD_ERROR";
    this.detail = "Missing required fields: " + fields.join(", ");
    this.invalidParams = fields;
  }
}
class BadRequest extends GeneralError {}
class NotFound extends GeneralError {
  constructor(message) {
    super();
    this.title = "NOT_FOUND";
    this.detail = message;
  }
}

module.exports = {
  GeneralError,
  MissingField,
  BadRequest,
  NotFound,
};
