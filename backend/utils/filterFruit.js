function filterFruit(fruits, { color, in_season, name } = {}) {
  const normalizedName = typeof name === "string" ? name.trim().toLowerCase() : "";

  const filtered = fruits.filter((fruit) => {
    if (color && fruit.color.toLowerCase() !== color.toLowerCase()) {
      return false;
    }

    if (in_season === "true" && fruit.in_season !== true) return false;
    if (in_season === "false" && fruit.in_season !== false) return false;

    if (normalizedName && !fruit.name.toLowerCase().includes(normalizedName)) {
      return false;
    }

    return true;
  });

  return filtered.sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { filterFruit };
