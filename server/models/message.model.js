const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "message",
    {
      id: {
        type: DataTypes.INTEGER,
        unsigned: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      chatId: {
        type: DataTypes.INTEGER,
        unsigned: true,
        allowNull: false,
        references: "chats",
        referencesKey: "id",
      },
      senderId: {
        type: DataTypes.INTEGER,
        unsigned: true,
        allowNull: false,
        references: "users",
        referencesKey: "id",
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
    },
    {
      updatedAt: false,
      underscored: true,
    }
  );
