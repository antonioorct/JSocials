const { DataTypes } = require("sequelize");

let Post;

function init(sequelize) {
  Post = sequelize.define("post", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attachment: {
      type: DataTypes.STRING,
    },
    numLikes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    numComments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
}

module.exports = { Post, init };
