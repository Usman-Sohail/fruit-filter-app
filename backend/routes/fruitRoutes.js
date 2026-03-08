const express = require("express");
const path = require("path");
const fs = require("fs");
const { filterFruit } = require("../utils/filterFruit");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/fruitList.json");

router.get("/", (req, res) => {
  let fruits;

  try {
    const raw = fs.readFileSync(dataPath, "utf-8");
    fruits = JSON.parse(raw);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load fruit data." });
  }

  const { color, in_season, name } = req.query;
  const filtered = filterFruit(fruits, { color, in_season, name });

  res.json(filtered);
});

module.exports = router;
