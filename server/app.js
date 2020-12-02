var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
var sequelize = require("./sequelize");
var router = require("./routes/routes");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router(app);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
});

module.exports = app;
