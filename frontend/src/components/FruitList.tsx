import type { Fruit, FruitSort, FruitSortKey } from "../types/fruit";

const COLOR_DOT: Record<string, string> = {
  red: "#e74c3c",
  yellow: "#f1c40f",
  green: "#27ae60",
  orange: "#e67e22",
  purple: "#8e44ad",
  blue: "#2980b9",
};

interface Props {
  fruits: Fruit[];
  sort: FruitSort;
  onSortChange: (key: FruitSortKey) => void;
}

function getAriaSort(sort: FruitSort, key: FruitSortKey): "none" | "ascending" | "descending" {
  if (sort.key !== key || sort.direction === "none") return "none";
  return sort.direction === "asc" ? "ascending" : "descending";
}

function sortIndicator(sort: FruitSort, key: FruitSortKey): "up" | "down" | "neutral" {
  if (sort.key !== key || sort.direction === "none") return "neutral";
  return sort.direction === "asc" ? "up" : "down";
}

function sortIndicatorSymbol(indicator: "up" | "down" | "neutral"): string {
  if (indicator === "up") return "↑";
  if (indicator === "down") return "↓";
  return "↕";
}

export default function FruitList({ fruits, sort, onSortChange }: Props) {
  if (fruits.length === 0) return null;

  return (
    <table className="fruit-table">
      <thead>
        <tr>
          <th scope="col" aria-sort={getAriaSort(sort, "name")}>
            <button
              type="button"
              className="sort-btn"
              onClick={() => onSortChange("name")}
              aria-label="Sort by name"
            >
              <span className="sort-label">Name</span>
              <span className={`sort-indicator ${sortIndicator(sort, "name")}`} aria-hidden="true">
                {sortIndicatorSymbol(sortIndicator(sort, "name"))}
              </span>
            </button>
          </th>
          <th scope="col" aria-sort={getAriaSort(sort, "color")}>
            <button
              type="button"
              className="sort-btn"
              onClick={() => onSortChange("color")}
              aria-label="Sort by color"
            >
              <span className="sort-label">Color</span>
              <span className={`sort-indicator ${sortIndicator(sort, "color")}`} aria-hidden="true">
                {sortIndicatorSymbol(sortIndicator(sort, "color"))}
              </span>
            </button>
          </th>
          <th scope="col" aria-sort={getAriaSort(sort, "in_season")}>
            <button
              type="button"
              className="sort-btn"
              onClick={() => onSortChange("in_season")}
              aria-label="Sort by in season status"
            >
              <span className="sort-label">In Season</span>
              <span
                className={`sort-indicator ${sortIndicator(sort, "in_season")}`}
                aria-hidden="true"
              >
                {sortIndicatorSymbol(sortIndicator(sort, "in_season"))}
              </span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {fruits.map((fruit) => (
          <tr key={fruit.name}>
            <td>{fruit.name}</td>
            <td>
              <span className="color-cell">
                <span
                  className="color-dot"
                  style={{ background: COLOR_DOT[fruit.color] ?? "#aaa" }}
                />
                {fruit.color.charAt(0).toUpperCase() + fruit.color.slice(1)}
              </span>
            </td>
            <td>
              <span className={fruit.in_season ? "badge badge-yes" : "badge badge-no"}>
                {fruit.in_season ? "Yes" : "No"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
