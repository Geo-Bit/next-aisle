const express = require("express");
const axios = require("axios");
const ShoppingListItem = require("../models/ShoppingListItem");
const PurchasedItem = require("../models/PurchasedItem");

const router = express.Router();

const customExclusions = ["sm", "lg"];

router.post("/api/items", async (req, res) => {
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

    const item = await ShoppingListItem.create({ name, category: aisle });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add item" });
  }
});

router.get("/api/items", async (req, res) => {
  try {
    const items = await ShoppingListItem.findAll();
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

router.get("/api/purchased-items", async (req, res) => {
  try {
    const purchasedItems = await PurchasedItem.findAll();
    res.json(purchasedItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch purchased items" });
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

module.exports = router;
