# Thought Process / Approach

## Overview

The goal was a simple, clean, interview-quality full-stack app: a Node/Express backend that serves filtered fruit data, and a React/Vite/TypeScript frontend that fetches and displays it with live filter controls synced to the URL. The implementation prioritises clarity and correctness over cleverness.

---

## Backend

### Separation of concerns

Three purposeful layers, each with a single job:

- **`server.js`** — wires up Express, CORS, and route mounting. Nothing else.
- **`routes/fruitRoutes.js`** — handles the HTTP concern: reads the request, delegates filtering, sends the response.
- **`utils/filterFruit.js`** — pure function: takes a list and a filters object, returns a filtered and sorted list. Has no knowledge of HTTP.

Keeping filtering in a pure function makes it trivially testable without starting a server.

### Filtering logic

All three filters are applied in a single `.filter()` pass:

- **`color`**: `toLowerCase()` on both sides — `?color=RED` behaves the same as `?color=red`.
- **`in_season`**: The query string is always a string, so we guard strictly for `"true"` or `"false"`. Any other value (e.g. `?in_season=banana`) is **ignored** rather than silently misfiltering. The alternative — treating any non-`"true"` string as `false` — would return wrong results and be very hard to debug.
- **`name`**: query is trimmed and lowercased first. Exact substring matches still work, and near-matches with a small edit distance also pass, so searches tolerate common typos like `aple` for `Apple` while staying bounded enough to avoid broad false positives.

At route level, query values are sanitized to strings before reaching the filter utility. This avoids runtime crashes from malformed query shapes (e.g. repeated params producing arrays).

Results are sorted alphabetically by name before returning, so the API response is always in a predictable order regardless of the JSON file's arrangement.

### Unit tests

`filterFruit` is a pure function with no side effects — the ideal unit test target. Tests use Node's built-in `node:test` and `node:assert` modules (Node 18+), so there are zero extra test dependencies. Eleven tests cover: no filters, each filter individually, combinations, invalid `in_season` values, whitespace name input, empty result set, and empty input.

---

## Frontend

### No React Router

URL sync is handled directly with `URLSearchParams`, `window.history.pushState`, `window.history.replaceState`, and a `popstate` listener. This covers the full requirement (shareable URLs, back/forward support) with no extra dependencies and keeps browser history behavior stable.

### Vite dev proxy

The frontend uses relative paths (`/api/fruit`) rather than hardcoding `http://localhost:3001`. The Vite config proxies `/api` to the backend during development. This means the URL would work unchanged if the app is deployed behind a reverse proxy — no code change required.

### Debouncing the name input

Without debounce, typing "strawberry" fires 10 API requests. With `useDebounce(filters.name, 300)`, we wait for 300 ms of inactivity before fetching. Dropdown selections (color, in_season) don't need this — they represent discrete, intentional choices and should feel instant.

The debounce also applies to URL updates: we don't push a new history entry on every keystroke, only after the user pauses.

### State design

One `filters` object drives everything: `{ name, color, in_season }`. When filters change, the URL is updated and a fetch fires. On initial load, filters are read from `window.location.search` (so a shared link restores the exact filter state). On `popstate`, filter state is re-read from the URL and the fetch re-runs.

### Component structure

Kept small and flat — two focused components plus the root App:

- `FilterBar` — controlled inputs, calls `onChange` with the full updated filters object.
- `FruitList` — stateless, renders sortable table headers (`name`, `color`, `in_season`) with an ascending/descending/disabled cycle.
- `NotFound` — fallback UI for invalid frontend paths.

### Results meta and accessibility

A small `aria-live="polite"` region displays the result count and doubles as the empty state message. Screen readers announce the count when it changes. Loading and error states use `role="status"` and `role="alert"` respectively.

---

## What I would add with more time

- **Frontend tests**: React Testing Library for FilterBar interactions and App integration flows.
- **Loading skeleton**: Replace the "Loading..." text with a table-shaped skeleton to avoid layout shift.
- **Color options from API**: The dropdown currently has a hardcoded colour list. A `/api/fruit/meta` endpoint returning the distinct colours in the dataset would make it data-driven.
- **Accessibility audit**: Run axe or Lighthouse and fix any remaining gaps, particularly around focus management when results update.
