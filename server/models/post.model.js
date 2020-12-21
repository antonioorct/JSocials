const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "post",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: "users",
        referencesKey: "id",
      },
      content: {
        type: DataTypes.STRING,
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
