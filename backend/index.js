const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to match your frontend's URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Database connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

// Sync the database
sequelize.sync();

// Routes
const itemsRouter = require("./routes/items");
app.use("/", itemsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
