const { DataTypes } = require("sequelize");

function init(sequelize) {
  sequelize.define("chat", {
    name: {
      type: DataTypes.STRING,
    },
  });
}

module.exports = { init };
