"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create a default shopping list
    const [results, metadata] = await queryInterface.sequelize.query(`
      INSERT INTO "ShoppingLists" ("name", "createdAt", "updatedAt")
      VALUES ('Default', NOW(), NOW())
      RETURNING "id";
    `);

    const defaultShoppingListId = results[0].id;

    // Update existing ShoppingListItems to use the default shopping list
    await queryInterface.sequelize.query(`
      UPDATE "ShoppingListItems"
      SET "shoppingListId" = ${defaultShoppingListId}
      WHERE "shoppingListId" IS NULL;
    `);

    // Change the column to not allow null values
    await queryInterface.changeColumn("ShoppingListItems", "shoppingListId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "ShoppingLists",
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("ShoppingListItems", "shoppingListId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "ShoppingLists",
        key: "id",
      },
    });
  },
};
