const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("mysql://root:root@localhost:3306/zavrsni");

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
