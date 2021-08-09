const { DataTypes } = require("sequelize");

let Chat;

function init(sequelize) {
  Chat = sequelize.define("chat", {
    name: {
      type: DataTypes.STRING,
    },
  });
}

module.exports = { Chat, init };
