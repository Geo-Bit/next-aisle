const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ShoppingList = require("./ShoppingList");

const ShoppingListItem = sequelize.define("ShoppingListItem", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shoppingListId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ShoppingList,
      key: "id",
    },
  },
});

ShoppingList.hasMany(ShoppingListItem, { foreignKey: "shoppingListId" });
ShoppingListItem.belongsTo(ShoppingList, { foreignKey: "shoppingListId" });

module.exports = ShoppingListItem;
