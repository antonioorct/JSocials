const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "userPostLike",
    {
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
    },
    {
      updatedAt: false,
      createdAt: false,
      tableName: "users_posts_likes",
      underscored: true,
    }
  );
