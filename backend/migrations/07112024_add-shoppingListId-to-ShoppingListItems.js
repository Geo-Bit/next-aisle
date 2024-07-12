"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("ShoppingListItems", "shoppingListId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "ShoppingLists",
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("ShoppingListItems", "shoppingListId");
  },
};
