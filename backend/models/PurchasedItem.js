const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

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

PurchasedItem.belongsTo(User, { foreignKey: { allowNull: true } });
User.hasMany(PurchasedItem, { foreignKey: { allowNull: true } });

module.exports = PurchasedItem;
