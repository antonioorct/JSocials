const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "comment",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unsigned: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unsigned: true,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unsigned: true,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      numLikes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unsigned: true,
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
