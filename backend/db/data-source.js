require("reflect-metadata");
const path = require("path");
const dotenv = require("dotenv");
const { DataSource } = require("typeorm");
const { FruitEntity } = require("./entities/Fruit");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required. Add it to backend/.env before running database commands.");
}

const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  synchronize: false,
  logging: false,
  entities: [FruitEntity],
  migrations: [path.resolve(__dirname, "../migrations/*.js")],
});

module.exports = AppDataSource;
module.exports.AppDataSource = AppDataSource;
