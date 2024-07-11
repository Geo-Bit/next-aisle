const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Adjust the path if your config is elsewhere

const ShoppingListItem = sequelize.define("ShoppingListItem", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ShoppingListItem;
