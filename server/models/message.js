const { DataTypes } = require("sequelize");

function init(sequelize) {
  sequelize.define("message", {
    chatId: {
      type: DataTypes.INTEGER,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}

module.exports = { init };
