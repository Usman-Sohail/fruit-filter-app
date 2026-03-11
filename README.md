# Fruit Fullstack Challenge

A small full-stack app built as part of an interview challenge.

**Backend:** Node.js + Express — serves fruit data from a JSON file with filtering support.
**Frontend:** React + Vite + TypeScript — displays fruit with a live filter UI synced to the URL query string.

---

## Project Structure

```
/
  backend/
    data/fruitList.json           # Fruit data source
    routes/fruitRoutes.js         # Express route: GET /api/fruit
    utils/filterFruit.js          # Pure filtering + sort logic
    utils/filterFruit.test.js     # Unit tests (Node built-in runner)
    server.js                     # Entry point
    package.json

  frontend/
    src/
      api/fruitApi.ts             # Fetch wrapper
      components/
        FilterBar.tsx             # Filter UI (name, color, in-season)
        FruitList.tsx             # Results table
        NotFound.tsx              # Invalid-path fallback page
      hooks/
        useDebounce.ts            # Debounce hook for name input
      types/fruit.ts              # Shared TypeScript interfaces
      App.tsx                     # Root component, state & URL sync
      index.css                   # All styles
    index.html
    vite.config.ts                # Includes dev proxy for /api
    package.json

  README.md
  APPROACH.md
  .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js 18+

### Backend

```bash
cd backend
npm install
npm run dev        # starts on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser. Both servers must be running.

---

## Running Tests

The backend has unit tests for the filtering logic. No extra test dependencies — uses Node's built-in `node:test` runner.

```bash
cd backend
npm test
```

Expected output: 11 passing tests covering filter combinations and edge cases.

---

## API

### `GET /api/fruit`

Returns all fruit sorted alphabetically by name. Supports query parameters:

| Param       | Type   | Behaviour                                                  |
|-------------|--------|------------------------------------------------------------|
| `color`     | string | Exact match, case-insensitive                              |
| `in_season` | string | `"true"` or `"false"` — any other value is ignored        |
| `name`      | string | Partial match plus typo-tolerant fuzzy match, case-insensitive (trimmed) |

Filters are combinable and all optional.
Malformed or non-string query shapes are sanitized to safe defaults.

**Examples:**

```
GET /api/fruit
GET /api/fruit?color=red
GET /api/fruit?in_season=true
GET /api/fruit?color=red&in_season=true
GET /api/fruit?name=app
GET /api/fruit?name=berry&in_season=false
```

**Response:** JSON array of fruit objects, sorted A–Z by name

```json
[
  { "name": "Apple", "color": "red", "in_season": true },
  { "name": "Cherry", "color": "red", "in_season": true }
]
```

---

## Features

- Filter by name (partial + fuzzy, case-insensitive, whitespace-safe), color (exact), and in-season status
- Filters are reflected in and initialized from the browser URL query string
- Browser back/forward navigation restores filter state with stable history semantics
- Name input is debounced (300 ms) to avoid hammering the API on every keystroke
- Clear filters button resets only dropdown filters and preserves current search text
- Results count shown after every fetch
- Client-side table sorting on Name / Color / In Season with 3-state toggle (ascending, descending, disabled)
- Not Found fallback page for invalid frontend paths
- Loading, error, and empty-state feedback with appropriate ARIA roles
- Vite dev proxy — frontend code uses relative `/api` paths, no hardcoded ports

---

## AI Usage

AI tooling (Claude Code by Anthropic) was used to assist with scaffolding, debugging, and documentation.
All architecture decisions and code were reviewed and validated by the developer.
