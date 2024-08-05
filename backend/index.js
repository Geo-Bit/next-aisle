const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use((req, res, next) => {
  console.log("Received request:", req.method, req.url);
  next();
});

app.use(
  cors({
    //origin: process.env.FRONTEND_URL, // Ensure this matches your frontend's URL
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"],
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
