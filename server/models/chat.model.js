const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "chat",
    {
      id: {
        type: DataTypes.INTEGER,
        unsigned: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      updatedAt: false,
      createdAt: false,
      underscored: true,
    }
  );
