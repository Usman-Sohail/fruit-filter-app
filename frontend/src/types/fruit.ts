export interface Fruit {
  name: string;
  color: string;
  in_season: boolean;
}

export interface FruitFilters {
  name: string;
  color: string;
  in_season: string; // "", "true", or "false"
}

export type FruitSortKey = "name" | "color" | "in_season";
export type FruitSortDirection = "asc" | "desc" | "none";

export interface FruitSort {
  key: FruitSortKey;
  direction: FruitSortDirection;
}
