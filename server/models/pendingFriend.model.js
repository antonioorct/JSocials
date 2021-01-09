const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "pendingFriend",
    {
      userOutgoingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
        field: "user_outgoing_id",
      },
      userIncomingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
        field: "user_incoming_id",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      updatedAt: false,
      underscored: true,
      tableName: "pending_friends",
    }
  );
