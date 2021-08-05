const path = require("path");
const fs = require("fs");

const BASE_API_ROUTE = "/api";
const ROUTES_FOLDER = "routes";

function init(app) {
  const routes = [];

  const normalizedPath = path.join(__dirname, ROUTES_FOLDER);

  fs.readdirSync(normalizedPath).forEach((file) =>
    routes.push(require(`./${ROUTES_FOLDER}/` + file))
  );

  routes.forEach((route) => app.use(BASE_API_ROUTE, route));
}

module.exports = { init };
