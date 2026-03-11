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
- Filters sync with URL query params (`name`, `color`, `in_season`, `page`, `page_size`).
- Name search is debounced (`300ms`), trims surrounding whitespace, and is matched fuzzily by the backend.
- Pagination is client-side, supports `10`, `20`, `50`, or `All`, and resets to page 1 when filters or page size change.
- Table supports 3-state sorting per column: ascending, descending, disabled.
- Invalid paths render a lightweight `NotFound` view.
