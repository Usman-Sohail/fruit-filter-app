import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import type { Fruit, FruitFilters, FruitSort, FruitSortKey } from "./types/fruit";
import { fetchFruit } from "./api/fruitApi";
import { useDebounce } from "./hooks/useDebounce";
import FilterBar from "./components/FilterBar";
import FruitList from "./components/FruitList";
import NotFound from "./components/NotFound";
import Pagination from "./components/Pagination";
import "./index.css";

const KNOWN_PATHS = ["/", "/index.html"];
const DEFAULT_PAGE_SIZE = "10";
const VALID_PAGE_SIZES = new Set(["10", "20", "50", "all"]);

const EMPTY_FILTERS: FruitFilters = { name: "", color: "", in_season: "" };

function readFiltersFromURL(): FruitFilters {
  const params = new URLSearchParams(window.location.search);
  return {
    name: (params.get("name") ?? "").trim(),
    color: params.get("color") ?? "",
    in_season: params.get("in_season") ?? "",
  };
}

function readPageFromURL(): number {
  const params = new URLSearchParams(window.location.search);
  const parsedPage = Number(params.get("page"));
  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

function readPageSizeFromURL(): string {
  const params = new URLSearchParams(window.location.search);
  const pageSize = params.get("page_size") ?? DEFAULT_PAGE_SIZE;
  return VALID_PAGE_SIZES.has(pageSize) ? pageSize : DEFAULT_PAGE_SIZE;
}

function areFiltersEqual(a: FruitFilters, b: FruitFilters): boolean {
  return a.name === b.name && a.color === b.color && a.in_season === b.in_season;
}

function buildSearchFromState(filters: FruitFilters, page: number, pageSize: string): string {
  const params = new URLSearchParams();
  if (filters.name) params.set("name", filters.name);
  if (filters.color) params.set("color", filters.color);
  if (filters.in_season) params.set("in_season", filters.in_season);
  if (page > 1) params.set("page", String(page));
  if (pageSize !== DEFAULT_PAGE_SIZE) params.set("page_size", pageSize);
  const search = params.toString();
  return search ? `?${search}` : "";
}

function syncStateToURL(
  filters: FruitFilters,
  page: number,
  pageSize: string,
  mode: "push" | "replace"
) {
  const nextSearch = buildSearchFromState(filters, page, pageSize);
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
  const [page, setPage] = useState<number>(readPageFromURL);
  const [pageSizeOption, setPageSizeOption] = useState<string>(readPageSizeFromURL);
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
    syncStateToURL(
      effectiveFilters,
      page,
      pageSizeOption,
      shouldReplaceHistoryRef.current ? "replace" : "push"
    );
    shouldReplaceHistoryRef.current = false;
    loadFruit(effectiveFilters);
  }, [debouncedName, color, in_season, isKnownPath, loadFruit, page, pageSizeOption]);

  useEffect(() => {
    if (!isKnownPath) return;
    const handlePop = () => {
      const nextFilters = readFiltersFromURL();
      const nextPage = readPageFromURL();
      const nextPageSize = readPageSizeFromURL();
      const filtersChanged = !areFiltersEqual(filters, nextFilters);
      const pageChanged = page !== nextPage;
      const pageSizeChanged = pageSizeOption !== nextPageSize;

      if (!filtersChanged && !pageChanged && !pageSizeChanged) {
        return;
      }

      shouldReplaceHistoryRef.current = true;

      if (filtersChanged) {
        setFilters(nextFilters);
      }

      if (pageChanged) {
        setPage(nextPage);
      }

      if (pageSizeChanged) {
        setPageSizeOption(nextPageSize);
      }
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [filters, isKnownPath, page, pageSizeOption]);

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
  const effectivePageSize = pageSizeOption === "all" ? Math.max(1, sortedFruits.length) : Number(pageSizeOption);
  const totalPages = Math.max(1, Math.ceil(sortedFruits.length / effectivePageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedFruits = useMemo(() => {
    const startIndex = (currentPage - 1) * effectivePageSize;
    return sortedFruits.slice(startIndex, startIndex + effectivePageSize);
  }, [currentPage, effectivePageSize, sortedFruits]);

  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage);
    }
  }, [currentPage, page]);

  function handleFiltersChange(nextFilters: FruitFilters) {
    setPage(1);
    setFilters(nextFilters);
  }

  function handlePageSizeChange(nextPageSize: string) {
    setPage(1);
    setPageSizeOption(nextPageSize);
  }

  function handleReset() {
    setPage(1);
    setFilters((prev) => ({ ...EMPTY_FILTERS, name: prev.name }));
  }

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
          onChange={handleFiltersChange}
          onReset={handleReset}
        />

        <div aria-live="polite" aria-atomic="true" className="results-meta">
          {!loading && !error && (
            <span>
              {fruits.length === 0
                ? hasFilters
                  ? "No fruit matches your filters."
                  : "No fruit available."
                : `${fruits.length} ${fruits.length === 1 ? "result" : "results"} total`}
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
          <>
            <FruitList fruits={paginatedFruits} sort={sort} onSortChange={handleSortChange} />
            <Pagination
              currentPage={currentPage}
              totalItems={sortedFruits.length}
              pageSize={effectivePageSize}
              pageSizeOption={pageSizeOption}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </main>
    </div>
    ) : (
      <NotFound />
    )
  );
}
