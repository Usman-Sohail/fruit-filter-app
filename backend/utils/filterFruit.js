function filterFruit(fruits, { color, in_season, name } = {}) {
  const filtered = fruits.filter((fruit) => {
    if (color && fruit.color.toLowerCase() !== color.toLowerCase()) {
      return false;
    }

    if (in_season === "true" && fruit.in_season !== true) return false;
    if (in_season === "false" && fruit.in_season !== false) return false;

    if (name && !fruit.name.toLowerCase().includes(name.toLowerCase())) {
      return false;
    }

    return true;
  });

  return filtered.sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { filterFruit };
