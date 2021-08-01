const authRouter = require("./routes/auth");

const BASE_API_ROUTE = "/api";

function init(app) {
  app.use(BASE_API_ROUTE, authRouter);
}

module.exports = { init };
