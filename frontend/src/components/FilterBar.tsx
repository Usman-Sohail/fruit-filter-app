import type { FruitFilters } from "../types/fruit";

const COLORS = ["red", "yellow", "green", "orange", "purple", "blue"];

interface Props {
  filters: FruitFilters;
  onChange: (filters: FruitFilters) => void;
  onReset: () => void;
}

export default function FilterBar({ filters, onChange, onReset }: Props) {
  function update(field: keyof FruitFilters, value: string) {
    onChange({ ...filters, [field]: value });
  }

  const hasFilters = filters.color || filters.in_season;

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="filter-name">Name</label>
        <input
          id="filter-name"
          type="text"
          placeholder="Search fruit name..."
          value={filters.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="filter-color">Color</label>
        <select
          id="filter-color"
          value={filters.color}
          onChange={(e) => update("color", e.target.value)}
        >
          <option value="">All colors</option>
          {COLORS.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-season">In Season</label>
        <select
          id="filter-season"
          value={filters.in_season}
          onChange={(e) => update("in_season", e.target.value)}
        >
          <option value="">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      {hasFilters && (
        <button className="btn-reset" onClick={onReset}>
          Clear filters
        </button>
      )}
    </div>
  );
}
