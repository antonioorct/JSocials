const { DataTypes } = require("sequelize");

function init(sequelize) {
  sequelize.define("userDetails", {
    bio: {
      type: DataTypes.STRING,
    },
    relationshipStatus: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    website: {
      type: DataTypes.STRING,
    },
  });
}

module.exports = { init };
