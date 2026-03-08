const express = require("express");
const path = require("path");
const fs = require("fs");
const { filterFruit } = require("../utils/filterFruit");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/fruitList.json");

function getStringQueryParam(value) {
  return typeof value === "string" ? value : "";
}

router.get("/", (req, res) => {
  let fruits;

  try {
    const raw = fs.readFileSync(dataPath, "utf-8");
    fruits = JSON.parse(raw);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load fruit data." });
  }

  const color = getStringQueryParam(req.query.color);
  const in_season = getStringQueryParam(req.query.in_season);
  const name = getStringQueryParam(req.query.name);
  const filtered = filterFruit(fruits, { color, in_season, name });

  res.json(filtered);
});

module.exports = router;
