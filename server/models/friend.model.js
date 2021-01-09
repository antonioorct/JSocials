const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "friend",
    {
      user1Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
      },
      user2Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      updatedAt: false,
      underscored: true,
      tableName: "friends",
    }
  );
