const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use((req, res, next) => {
  let userEmail;
  if (process.env.ENVIRONMENT == "DEV") {
    userEmail = process.env.TEST_EMAIL;
  } else {
    userEmail = req.headers["cf-access-authenticated-user-email"];
  }
  if (userEmail) {
    req.userEmail = userEmail;
    console.log(`Authenticated user: ${userEmail}`);
  } else {
    res.status(403).send("Forbidden");
  }
  next();
});

app.use((req, res, next) => {
  const remoteAddress = req.ip || req.connection.remoteAddress;
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  console.log("Received request, yo:", req.method, req.url);
  console.log(`Incoming request from: ${remoteAddress}`);
  next();
});

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.PROXY_URL,
      process.env.PUBLIC_URL,
    ], // Ensure this matches your frontend's URL
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
sequelize
  .sync({ alter: true }) // Using alter to update the existing schema without dropping tables
  .then(() => console.log("Database synced..."))
  .catch((err) => console.log("Error syncing database: " + err));

// Routes
const itemsRouter = require("./routes/items");
app.use("/", itemsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
