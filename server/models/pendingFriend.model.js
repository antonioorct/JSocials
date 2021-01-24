const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "pendingFriend",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userOutgoingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userIncomingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      updatedAt: false,
      underscored: true,
    }
  );
