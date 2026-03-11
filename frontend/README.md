# Frontend

React + Vite + TypeScript client for the Fruit Browser.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Notes

- Uses relative API path `/api/fruit` (proxied to backend via Vite in development).
- Filters sync with URL query params (`name`, `color`, `in_season`).
- Name search is debounced (`300ms`), trims surrounding whitespace, and is matched fuzzily by the backend.
- Table supports 3-state sorting per column: ascending, descending, disabled.
- Invalid paths render a lightweight `NotFound` view.
