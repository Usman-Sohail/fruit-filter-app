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
