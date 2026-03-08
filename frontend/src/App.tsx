import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import type { Fruit, FruitFilters, FruitSort, FruitSortKey } from "./types/fruit";
import { fetchFruit } from "./api/fruitApi";
import { useDebounce } from "./hooks/useDebounce";
import FilterBar from "./components/FilterBar";
import FruitList from "./components/FruitList";
import NotFound from "./components/NotFound";
import "./index.css";

const KNOWN_PATHS = ["/", "/index.html"];

const EMPTY_FILTERS: FruitFilters = { name: "", color: "", in_season: "" };

function readFiltersFromURL(): FruitFilters {
  const params = new URLSearchParams(window.location.search);
  return {
    name: (params.get("name") ?? "").trim(),
    color: params.get("color") ?? "",
    in_season: params.get("in_season") ?? "",
  };
}

function areFiltersEqual(a: FruitFilters, b: FruitFilters): boolean {
  return a.name === b.name && a.color === b.color && a.in_season === b.in_season;
}

function buildSearchFromFilters(filters: FruitFilters): string {
  const params = new URLSearchParams();
  if (filters.name) params.set("name", filters.name);
  if (filters.color) params.set("color", filters.color);
  if (filters.in_season) params.set("in_season", filters.in_season);
  const search = params.toString();
  return search ? `?${search}` : "";
}

function syncFiltersToURL(filters: FruitFilters, mode: "push" | "replace") {
  const nextSearch = buildSearchFromFilters(filters);
  if (window.location.search === nextSearch) return;

  const nextURL = `${window.location.pathname}${nextSearch}`;
  if (mode === "replace") {
    window.history.replaceState(null, "", nextURL);
    return;
  }

  window.history.pushState(null, "", nextURL);
}

export default function App() {
  const isKnownPath = KNOWN_PATHS.includes(window.location.pathname);

  const [filters, setFilters] = useState<FruitFilters>(readFiltersFromURL);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const shouldReplaceHistoryRef = useRef(false);
  const [sort, setSort] = useState<FruitSort>({ key: "name", direction: "asc" });

  const debouncedName = useDebounce(filters.name, 300);
  const { color, in_season } = filters;

  const loadFruit = useCallback(async (f: FruitFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFruit(f);
      setFruits(data);
    } catch {
      setError("Could not reach the API. Make sure the backend is running on port 3001.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isKnownPath) return;
    const effectiveFilters: FruitFilters = { name: debouncedName.trim(), color, in_season };
    syncFiltersToURL(effectiveFilters, shouldReplaceHistoryRef.current ? "replace" : "push");
    shouldReplaceHistoryRef.current = false;
    loadFruit(effectiveFilters);
  }, [debouncedName, color, in_season, isKnownPath, loadFruit]);

  useEffect(() => {
    if (!isKnownPath) return;
    const handlePop = () => {
      const nextFilters = readFiltersFromURL();
      setFilters((prev) => {
        if (areFiltersEqual(prev, nextFilters)) return prev;
        shouldReplaceHistoryRef.current = true;
        return nextFilters;
      });
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [isKnownPath]);

  const hasFilters = filters.name || filters.color || filters.in_season;
  const sortedFruits = useMemo(() => {
    if (sort.direction === "none") {
      return [...fruits];
    }

    const list = [...fruits];
    list.sort((a, b) => {
      if (sort.key === "in_season") {
        const comparison = Number(a.in_season) - Number(b.in_season);
        return sort.direction === "asc" ? comparison : -comparison;
      }

      const comparison = a[sort.key].localeCompare(b[sort.key]);
      return sort.direction === "asc" ? comparison : -comparison;
    });
    return list;
  }, [fruits, sort]);

  function handleSortChange(key: FruitSortKey) {
    setSort((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key, direction: "none" };
        return { key, direction: "asc" };
      }
      return { key, direction: "asc" };
    });
  }

  return (
    isKnownPath ? (
    <div className="app">
      <header className="app-header">
        <h1>Fruit Browser</h1>
        <p>Browse and filter fresh fruit data from the API.</p>
      </header>

      <main className="app-main">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() =>
            setFilters((prev) => ({ ...EMPTY_FILTERS, name: prev.name }))
          }
        />

        <div aria-live="polite" aria-atomic="true" className="results-meta">
          {!loading && !error && (
            <span>
              {fruits.length === 0
                ? hasFilters
                  ? "No fruit matches your filters."
                  : "No fruit available."
                : `Showing ${fruits.length} ${fruits.length === 1 ? "result" : "results"}`}
            </span>
          )}
        </div>

        {loading && (
          <div role="status" className="status-msg">
            Loading...
          </div>
        )}
        {error && (
          <div role="alert" className="status-msg error">
            {error}
          </div>
        )}
        {!loading && !error && (
          <FruitList fruits={sortedFruits} sort={sort} onSortChange={handleSortChange} />
        )}
      </main>
    </div>
    ) : (
      <NotFound />
    )
  );
}
