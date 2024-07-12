const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ShoppingList = sequelize.define("ShoppingList", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ShoppingList;
