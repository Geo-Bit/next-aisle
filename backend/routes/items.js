const express = require("express");
const axios = require("axios");
const { Op } = require("sequelize");
const sequelize = require("../config/database");
const ShoppingList = require("../models/ShoppingList");
const ShoppingListItem = require("../models/ShoppingListItem");
const PurchasedItem = require("../models/PurchasedItem");
const User = require("../models/User");

const router = express.Router();

const customExclusions = ["sm", "lg"];

router.post("/api/shopping-lists", async (req, res) => {
  try {
    const { name } = req.body;
    const userEmail = req.userEmail;

    // Find or create the user
    let user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      user = await User.create({ email: userEmail });
    }

    // Create a new shopping list for the user
    const list = await ShoppingList.create({ name, UserId: user.id });

    res.status(201).json(list);
  } catch (error) {
    console.error("Error creating shopping list:", error);
    res.status(500).json({ error: "Failed to create shopping list" });
  }
});

router.get("/api/shopping-lists", async (req, res) => {
  try {
    const userEmail = req.userEmail;

    // Find or create the user
    let user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      user = await User.create({ email: userEmail });
    }

    // Fetch the user's shopping lists
    const lists = await ShoppingList.findAll({ where: { UserId: user.id } });

    res.json({ userEmail, lists });
  } catch (error) {
    console.error("Error fetching shopping lists:", error);
    res.status(500).json({ error: "Failed to fetch shopping lists" });
  }
});

router.post("/api/shopping-lists/:listId/items", async (req, res) => {
  const { listId } = req.params;
  const { name } = req.body;

  try {
    let strippedDescription = name.replace(/[^a-zA-Z ]+/g, "");
    strippedDescription = strippedDescription.toLowerCase();
    customExclusions.forEach((excl) => {
      const regex = new RegExp(`^${excl} `, "g");
      strippedDescription = strippedDescription.replace(regex, "");
    });

    const response = await axios.get(
      `https://api.spoonacular.com/food/ingredients/autocomplete`,
      {
        params: {
          query: strippedDescription,
          number: 1,
          metaInformation: true,
        },
        headers: { "x-api-key": process.env.SPOONACULAR_API_KEY },
      }
    );

    let aisle = "";
    if (response.data.length > 0) {
      aisle = response.data[0].aisle;
    }

    const item = await ShoppingListItem.create({
      name,
      category: aisle,
      shoppingListId: listId,
    });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add item" });
  }
});

router.get("/api/shopping-lists/:listId/items", async (req, res) => {
  const { listId } = req.params;
  console.log("Fetching items for shopping list ID:", listId); // Debugging line

  try {
    const items = await ShoppingListItem.findAll({
      where: { shoppingListId: listId },
    });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

router.delete("/api/items/:id", async (req, res) => {
  try {
    await ShoppingListItem.destroy({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

router.post("/api/items/:id/check", async (req, res) => {
  try {
    const item = await ShoppingListItem.findByPk(req.params.id);
    if (item) {
      await PurchasedItem.create({
        name: item.name,
        category: item.category,
        purchasedAt: new Date(),
      });
      await item.destroy();
      res.status(200).end();
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to check item" });
  }
});

router.put("/api/items/:id", async (req, res) => {
  const { name } = req.body;

  try {
    let strippedDescription = name.replace(/[^a-zA-Z ]+/g, "");
    strippedDescription = strippedDescription.toLowerCase();
    customExclusions.forEach((excl) => {
      const regex = new RegExp(`^${excl} `, "g");
      strippedDescription = strippedDescription.replace(regex, "");
    });

    const response = await axios.get(
      `https://api.spoonacular.com/food/ingredients/autocomplete`,
      {
        params: {
          query: strippedDescription,
          number: 1,
          metaInformation: true,
        },
        headers: { "x-api-key": process.env.SPOONACULAR_API_KEY },
      }
    );

    let aisle = "";
    if (response.data.length > 0) {
      aisle = response.data[0].aisle;
    }

    await ShoppingListItem.update(
      { name, category: aisle },
      { where: { id: req.params.id } }
    );

    const updatedItem = await ShoppingListItem.findByPk(req.params.id);
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update item" });
  }
});

router.get("/api/purchased-items", async (req, res) => {
  try {
    const purchasedItems = await PurchasedItem.findAll();
    res.json(purchasedItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch purchased items" });
  }
});

router.get("/api/recommendations", async (req, res) => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  try {
    const recommendations = await PurchasedItem.findAll({
      attributes: [
        "name",
        "category",
        [sequelize.fn("COUNT", sequelize.col("name")), "count"],
      ],
      where: {
        purchasedAt: {
          [Op.gte]: twoWeeksAgo,
        },
      },
      group: ["name", "category"],
      having: sequelize.literal("COUNT(name) > 2"),
      order: [[sequelize.literal("count"), "DESC"]],
    });

    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

module.exports = router;
