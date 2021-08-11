const { DataTypes } = require("sequelize");

let UserDetails;

function init(sequelize) {
  UserDetails = sequelize.define("userDetails", {
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

module.exports = { UserDetails, init };
