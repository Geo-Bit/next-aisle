const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//ROUTES//

//create an item
app.post("/items", async(req,res) =>{
    try {
        const { description } = req.body;
        const newItem = await pool.query(
            "INSERT INTO shopping_list (description) VALUES($1) RETURNING * ",
            [description]
        );

        res.json(newItem.rows[0]);

    } catch (error) {
        console.error(error.message);
    }
});

//get all items
app.get("/items", async(req,res) => {
    try {
        const allItems = await pool.query("SELECT * FROM shopping_list");
        res.json(allItems.rows);
    } catch (error) {
        console.error(error.message)
    }
});

//get an item
app.get("/items/:id", async(req,res) => {
    try {
        const {id} = req.params;
        const item = await pool.query("SELECT * FROM shopping_list WHERE item_id = $1",[id]);

        res.json(item.rows[0]);

    } catch (error) {
        console.error(error.message)
    }
});

//update an item
app.put("/items/:id", async(req,res) => {
    try {
        const {id} = req.params;
        const {description} = req.body;
        const updateItem = await pool.query("UPDATE shopping_list SET description = $1 WHERE item_id = $2",[description, id]);
        res.json("Item was updated!");
    } catch (error) {
        console.error(error.message);
    }
});

//delete a item
app.delete("/items/:id", async(req,res) => {
    try {
        const {id} = req.params;
        const deleteItem = await pool.query("DELETE FROM shopping_list WHERE item_id = $1", [id]);
        res.json("Item was deleted!");
    } catch (error) {
        console.error(error.message);
    }
});

app.listen(5000, () =>{
    console.log("server has started on port 5000")
});