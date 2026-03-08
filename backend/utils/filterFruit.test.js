const { test } = require("node:test");
const assert = require("node:assert/strict");
const { filterFruit } = require("./filterFruit");

const FRUITS = [
  { name: "Apple", color: "red", in_season: true },
  { name: "Banana", color: "yellow", in_season: true },
  { name: "Blueberry", color: "blue", in_season: false },
  { name: "Cherry", color: "red", in_season: true },
  { name: "Grape", color: "purple", in_season: false },
  { name: "Pineapple", color: "yellow", in_season: false },
];

test("returns all fruit sorted alphabetically when no filters are given", () => {
  const result = filterFruit(FRUITS);
  const names = result.map((f) => f.name);
  assert.deepEqual(names, ["Apple", "Banana", "Blueberry", "Cherry", "Grape", "Pineapple"]);
});

test("filters by color — exact match, case-insensitive", () => {
  const result = filterFruit(FRUITS, { color: "RED" });
  assert.equal(result.length, 2);
  assert.ok(result.every((f) => f.color === "red"));
});

test("filters by in_season=true", () => {
  const result = filterFruit(FRUITS, { in_season: "true" });
  assert.ok(result.length > 0);
  assert.ok(result.every((f) => f.in_season === true));
});

test("filters by in_season=false", () => {
  const result = filterFruit(FRUITS, { in_season: "false" });
  assert.ok(result.length > 0);
  assert.ok(result.every((f) => f.in_season === false));
});

test("ignores an invalid in_season value instead of silently misfiltering", () => {
  // A bad value like "banana" must not skew results — should return all fruit
  const result = filterFruit(FRUITS, { in_season: "banana" });
  assert.equal(result.length, FRUITS.length);
});

test("filters by name — partial match, case-insensitive", () => {
  const result = filterFruit(FRUITS, { name: "app" });
  // should match "Apple" and "Pineapple"
  assert.equal(result.length, 2);
  assert.ok(result.every((f) => f.name.toLowerCase().includes("app")));
});

test("filters by name when query has surrounding whitespace", () => {
  const result = filterFruit(FRUITS, { name: "  app  " });
  assert.equal(result.length, 2);
  assert.ok(result.every((f) => f.name.toLowerCase().includes("app")));
});

test("combines color and in_season filters", () => {
  const result = filterFruit(FRUITS, { color: "red", in_season: "true" });
  assert.ok(result.every((f) => f.color === "red" && f.in_season === true));
});

test("combines name and in_season filters", () => {
  const result = filterFruit(FRUITS, { name: "a", in_season: "false" });
  assert.ok(result.every((f) => f.name.toLowerCase().includes("a") && f.in_season === false));
});

test("returns empty array when no fruit matches filters", () => {
  const result = filterFruit(FRUITS, { color: "green" });
  assert.deepEqual(result, []);
});

test("returns empty array when fruit list is empty", () => {
  const result = filterFruit([], { color: "red" });
  assert.deepEqual(result, []);
});
