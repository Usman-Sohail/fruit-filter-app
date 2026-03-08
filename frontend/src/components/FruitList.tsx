import type { Fruit } from "../types/fruit";

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
}

export default function FruitList({ fruits }: Props) {
  if (fruits.length === 0) return null;

  return (
    <table className="fruit-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Color</th>
          <th>In Season</th>
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
