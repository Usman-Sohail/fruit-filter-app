function getEditDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) dp[i][0] = i;
  for (let j = 0; j < cols; j += 1) dp[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + substitutionCost
      );
    }
  }

  return dp[a.length][b.length];
}

function getFuzzyThreshold(queryLength) {
  if (queryLength <= 3) return 0;
  if (queryLength <= 4) return 1;
  if (queryLength <= 8) return 2;
  return 3;
}

function hasSameBoundaryChars(candidateName, query) {
  return candidateName[0] === query[0] && candidateName.at(-1) === query.at(-1);
}

function matchesName(candidateName, query) {
  if (!query) return true;
  if (candidateName.includes(query)) return true;

  const threshold = getFuzzyThreshold(query.length);
  if (threshold === 0) return false;

  if (
    Math.abs(candidateName.length - query.length) <= threshold &&
    hasSameBoundaryChars(candidateName, query)
  ) {
    return getEditDistance(candidateName, query) <= threshold;
  }

  const minWindowLength = query.length;
  const maxWindowLength = Math.min(candidateName.length, query.length + threshold);

  for (let windowLength = minWindowLength; windowLength <= maxWindowLength; windowLength += 1) {
    for (let start = 0; start <= candidateName.length - windowLength; start += 1) {
      const slice = candidateName.slice(start, start + windowLength);
      if (!hasSameBoundaryChars(slice, query)) {
        continue;
      }

      if (getEditDistance(slice, query) <= threshold) {
        return true;
      }
    }
  }

  return false;
}

function filterFruit(fruits, { color, in_season, name } = {}) {
  const normalizedName = typeof name === "string" ? name.trim().toLowerCase() : "";

  const filtered = fruits.filter((fruit) => {
    if (color && fruit.color.toLowerCase() !== color.trim().toLowerCase()) {
      return false;
    }

    if (in_season === "true" && fruit.in_season !== true) return false;
    if (in_season === "false" && fruit.in_season !== false) return false;

    if (!matchesName(fruit.name.toLowerCase(), normalizedName)) {
      return false;
    }

    return true;
  });

  return filtered.sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { filterFruit, getEditDistance, matchesName };
