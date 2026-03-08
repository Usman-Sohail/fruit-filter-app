import type { Fruit, FruitFilters } from "../types/fruit";

const BASE_URL = "/api/fruit";

export async function fetchFruit(filters: FruitFilters): Promise<Fruit[]> {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.color) params.set("color", filters.color);
  if (filters.in_season) params.set("in_season", filters.in_season);

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
