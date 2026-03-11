const express = require("express");
const AppDataSource = require("../db/data-source");
const { FruitEntity } = require("../db/entities/Fruit");
const { filterFruit } = require("../utils/filterFruit");

const router = express.Router();

function getStringQueryParam(value) {
  return typeof value === "string" ? value : "";
}

router.get("/", async (req, res) => {
  let fruits;

  try {
    const repository = AppDataSource.getRepository(FruitEntity);
    fruits = await repository.find();
  } catch (err) {
    return res.status(500).json({ error: "Failed to load fruit data from the database." });
  }

  const color = getStringQueryParam(req.query.color);
  const in_season = getStringQueryParam(req.query.in_season);
  const name = getStringQueryParam(req.query.name);
  const filtered = filterFruit(fruits, { color, in_season, name });

  res.json(filtered);
});

module.exports = router;
