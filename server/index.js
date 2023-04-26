const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//ROUTES//

//create an item
app.post("/items", async (req, res) => {
  //get item category from FoodData Central
  try {
    const description = req.body["description"];
    const aisle = req.body["aisle"];
    const newItem = await pool.query(
      "INSERT INTO shopping_list (description, aisle) VALUES($1,$2) RETURNING * ",
      [description, aisle]
    );

    res.json(newItem.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//get all items
app.get("/items", async (req, res) => {
  try {
    const allItems = await pool.query("SELECT * FROM shopping_list");
    res.json(allItems.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//get an item
app.get("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await pool.query(
      "SELECT * FROM shopping_list WHERE item_id = $1",
      [id]
    );

    res.json(item.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//update an item
app.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const description = req.body["description"];
    const aisle = req.body["aisle"];
    //const aisle = req.body["aisle"];
    const updateItem = await pool.query(
      "UPDATE shopping_list SET description= $1, aisle= $2 WHERE item_id= $3",
      [description, aisle, id]
    );
    //(description, aisle) VALUES($1,$2)
    res.json("Item was updated!");
  } catch (error) {
    console.error(error.message);
  }
});

//delete a item
app.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteItem = await pool.query(
      "DELETE FROM shopping_list WHERE item_id = $1",
      [id]
    );
    res.json("Item was deleted!");
  } catch (error) {
    console.error(error.message);
  }
});

//add item to purchased
app.post("/purchased", async (req, res) => {
  //get timestamp
  t = new Date(Date.now()).toISOString();
  try {
    const { description } = req.body;
    const newItem = await pool.query(
      "INSERT INTO purchase_history (description,ts) VALUES($1,$2) RETURNING * ",
      [description, t]
    );

    res.json(newItem.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//get purchased items
app.get("/purchased", async (req, res) => {
  try {
    const allItems = await pool.query("SELECT * FROM purchase_history");
    res.json(allItems.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//create a list
app.post("/list", async (req, res) => {
  try {
    const listName = req.body["listName"];
    const layout = "";
    const newList = await pool.query(
      "INSERT INTO lists (list_name, layout) VALUES($1,$2) RETURNING * ",
      [listName, layout]
    );

    res.json(newList.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//get all lists
app.get("/purchased", async (req, res) => {
  try {
    const allLists = await pool.query("SELECT * FROM lists");
    res.json(allLists.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
