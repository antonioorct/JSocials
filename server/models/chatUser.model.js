const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "chatUser",
    {
      chatId: {
        type: DataTypes.INTEGER,
        unsigned: true,
        allowNull: false,
        references: {
          model: "chats",
          foreignKey: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        unsigned: true,
        allowNull: false,
        references: {
          model: "users",
          foreignKey: "id",
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      updatedAt: false,
      underscored: true,
      tableName: "chats_users",
    }
  );
