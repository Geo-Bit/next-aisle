// models/ShoppingList.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const ShoppingList = sequelize.define("ShoppingList", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

ShoppingList.belongsTo(User); // Each shopping list belongs to a user
User.hasMany(ShoppingList); // A user can have multiple shopping lists

module.exports = ShoppingList;
