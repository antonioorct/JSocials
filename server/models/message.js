const { DataTypes } = require("sequelize");

let Message;

function init(sequelize) {
  Message = sequelize.define("message", {
    chatId: {
      type: DataTypes.INTEGER,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}

module.exports = { Message, init };
