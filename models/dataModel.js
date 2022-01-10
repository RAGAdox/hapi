const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");
const Data = sequelize.define("data", {
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Data;
