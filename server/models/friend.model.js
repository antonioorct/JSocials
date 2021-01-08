const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "friend",
    {
      user1Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user1_id",
      },
      user2Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user2_id",
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
