const express = require("express");
const axios = require("axios");
const ShoppingListItem = require("../models/ShoppingListItem");

const router = express.Router();

const customExclusions = ["sm", "lg"];

router.post("/api/items", async (req, res) => {
  const { name } = req.body;

  try {
    // remove special characters and numbers from description
    let strippedDescription = name.replace(/[^a-zA-Z ]+/g, "");
    // convert string to all lowercase
    strippedDescription = strippedDescription.toLowerCase();
    // remove exclusions
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

module.exports = router;
