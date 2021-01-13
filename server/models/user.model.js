const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      location: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.STRING,
      },
      website: {
        type: DataTypes.STRING,
      },
      relationshipStatus: {
        type: DataTypes.STRING,
      },
      imagePath: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
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
