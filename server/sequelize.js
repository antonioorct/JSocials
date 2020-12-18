const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:3306/${process.env.DB_DB}`
);

// try {
//    sequelize.authenticate();
//   console.log("Database connection OK!");
// } catch (error) {
//   console.log("Unable to connect to the database:");
//   console.log(error.message);
//   process.exit(1);
// }

console.log("Connected to database");

const models = [require("./models/user.model")];

models.forEach((model) => {
  model(sequelize);
});

module.exports = sequelize;
