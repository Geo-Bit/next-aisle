const { Sequelize } = require("sequelize");
require("dotenv").config();
const databaseUrl = process.env.DATABASE_URL;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

console.log("DATABASE_URL:", databaseUrl);

module.exports = sequelize;
