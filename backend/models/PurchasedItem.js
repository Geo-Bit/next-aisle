const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PurchasedItem = sequelize.define("PurchasedItem", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  purchasedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = PurchasedItem;
